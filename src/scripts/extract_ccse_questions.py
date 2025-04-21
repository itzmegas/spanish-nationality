#!/usr/bin/env python3
import re
import json
import os

# Ruta al archivo de texto extraído del PDF
txt_file = '/tmp/manual_ccse.txt'

# Información de las páginas para cada cuestionario
QUESTIONNAIRE_PAGES = {
    1: {"questions": (17, 27), "answers": 93},
    2: {"questions": (35, 38), "answers": 95},
    3: {"questions": (45, 47), "answers": 97},
    4: {"questions": (61, 64), "answers": 99},
    5: {"questions": (83, 91), "answers": 101}
}

# Función para extraer las preguntas y opciones
def extract_questions(file_path):
    questions = {}
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extraer todas las preguntas con un enfoque más simple
    # Buscar líneas que comiencen con un número de 4 dígitos
    question_pattern = r'(\d{4})\s+([^\n]+)'
    question_matches = re.findall(question_pattern, content)
    
    for match in question_matches:
        question_id = match[0]
        question_text = match[1].strip()
        
        # Ignorar líneas que no son preguntas reales
        if len(question_text) < 5 or question_text.startswith('Tabla') or question_text.startswith('Fig'):
            continue
        
        # Buscar las opciones que siguen a la pregunta
        question_pos = content.find(f"{question_id} {question_text}")
        if question_pos == -1:
            continue
            
        # Extraer el texto que sigue a la pregunta
        next_text = content[question_pos + len(f"{question_id} {question_text}"):question_pos + 1000]
        
        # Intentar encontrar opciones a), b), c)
        options_abc = re.search(r'\na\)\s+([^\n]+)\s+b\)\s+([^\n]+)\s+c\)\s+([^\n]+)', next_text)
        
        # Intentar encontrar opciones a), b) (verdadero/falso)
        options_ab = re.search(r'\na\)\s+(Verdadero\.?)\s+b\)\s+(Falso\.?)', next_text)
        
        if options_abc:
            option_a = options_abc.group(1).strip()
            option_b = options_abc.group(2).strip()
            option_c = options_abc.group(3).strip()
            
            questions[question_id] = {
                "id": question_id,
                "question": question_text,
                "options": {
                    "a": option_a,
                    "b": option_b,
                    "c": option_c
                },
                "option_count": 3,
                "type": "multiple_choice"
            }
        elif options_ab:
            option_a = options_ab.group(1).strip()
            option_b = options_ab.group(2).strip()
            
            questions[question_id] = {
                "id": question_id,
                "question": question_text,
                "options": {
                    "a": option_a,
                    "b": option_b
                },
                "option_count": 2,
                "type": "true_false"
            }
        else:
            # Intentar con un patrón más genérico para opciones a) y b)
            options_generic = re.search(r'\na\)\s+([^\n]+)\s+b\)\s+([^\n]+)', next_text)
            if options_generic:
                option_a = options_generic.group(1).strip()
                option_b = options_generic.group(2).strip()
                
                # Verificar si son opciones de verdadero/falso
                if ('verdadero' in option_a.lower() and 'falso' in option_b.lower()):
                    questions[question_id] = {
                        "id": question_id,
                        "question": question_text,
                        "options": {
                            "a": option_a,
                            "b": option_b
                        },
                        "option_count": 2,
                        "type": "true_false"
                    }
    
    return questions

# Función para extraer las respuestas correctas usando las páginas específicas
def extract_answers(file_path):
    answers = {}
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Buscar las respuestas en las páginas específicas del solucionario para cada cuestionario
    for task_num, page_info in QUESTIONNAIRE_PAGES.items():
        answer_page = page_info["answers"]
        
        # Buscar la sección de respuestas para esta tarea
        page_pattern = rf'\n{answer_page}\n'
        page_match = re.search(page_pattern, content)
        
        if page_match:
            page_start = page_match.start()
            # Buscar en las siguientes 100 líneas (aproximadamente) para encontrar las respuestas
            section_content = content[page_start:page_start + 5000]  # Tomar un fragmento suficientemente grande
            
            # Buscar la sección de soluciones para esta tarea
            task_pattern = rf'TAREA {task_num}\s+SOLUCIONES'
            task_match = re.search(task_pattern, section_content)
            
            if task_match:
                solution_start = task_match.end()
                solution_content = section_content[solution_start:]
                
                # Patrón para encontrar las respuestas en formato "1001 a"
                answer_pattern = r'\s*(\d{4})\s+([abc])'
                answers_matches = re.findall(answer_pattern, solution_content)
                
                for match in answers_matches:
                    question_id = match[0]
                    correct_answer = match[1]
                    answers[question_id] = correct_answer
    
    # Si no se encontraron suficientes respuestas, buscar en todo el documento
    if len(answers) < 100:  # Umbral arbitrario
        # Buscar todas las secciones de soluciones en el documento
        solution_sections = re.findall(r'SOLUCIONES.*?(?=TAREA|$)', content, re.DOTALL)
        
        for section in solution_sections:
            # Patrón para encontrar las respuestas en formato "1001 a"
            answer_pattern = r'\s*(\d{4})\s+([abc])'
            answers_matches = re.findall(answer_pattern, section)
            
            for match in answers_matches:
                question_id = match[0]
                correct_answer = match[1]
                answers[question_id] = correct_answer
        
        # Buscar también en formato alternativo que pueda existir en el documento
        alt_pattern = r'(\d{4})\s*:\s*([abc])'
        alt_matches = re.findall(alt_pattern, content)
        for match in alt_matches:
            question_id = match[0]
            correct_answer = match[1]
            answers[question_id] = correct_answer
    
    return answers

# Combinar preguntas y respuestas
def combine_questions_and_answers(questions, answers):
    combined_data = []
    
    for question_id, question_data in questions.items():
        if question_id in answers:
            # Verificar que la respuesta sea válida para esta pregunta
            correct_answer = answers[question_id]
            option_count = question_data.get("option_count", 3)  # Por defecto, 3 opciones
            
            # Si la pregunta tiene solo 2 opciones y la respuesta es 'c', ajustar a 'b'
            if option_count == 2 and correct_answer == 'c':
                correct_answer = 'b'
            
            # Solo incluir la respuesta si es válida para esta pregunta
            if (option_count == 3 and correct_answer in ['a', 'b', 'c']) or \
               (option_count == 2 and correct_answer in ['a', 'b']):
                question_data["correct_answer"] = correct_answer
                combined_data.append(question_data)
    
    return combined_data

# Función para filtrar preguntas no válidas
def filter_invalid_questions(questions):
    valid_questions = {}
    
    for question_id, question_data in questions.items():
        # Verificar que el ID sea un número de 4 dígitos válido (1000-5999)
        if not (1000 <= int(question_id) <= 5999):
            continue
            
        # Verificar que la pregunta tenga un texto válido (no sea muy larga ni muy corta)
        question_text = question_data["question"]
        if len(question_text) < 3 or len(question_text) > 300 or '\n' in question_text:
            continue
            
        # Verificar que las opciones sean válidas
        options = question_data["options"]
        if any(len(opt) < 1 or len(opt) > 200 or '\n' in opt for opt in options.values()):
            continue
            
        # Verificar que la pregunta termine con un signo de interrogación o puntos suspensivos
        if not (question_text.endswith('?') or question_text.endswith('...') or question_text.endswith('…')):
            # Intentar arreglar la pregunta añadiendo puntos suspensivos si no termina con un signo de puntuación
            if not any(question_text.endswith(p) for p in ['.', ',', ':', ';', '!']):
                question_data["question"] = question_text + '...'
        
        valid_questions[question_id] = question_data
    
    return valid_questions

# Extraer preguntas y respuestas
questions = extract_questions(txt_file)
print(f"Se encontraron {len(questions)} preguntas en el documento")

# Filtrar preguntas no válidas
questions = filter_invalid_questions(questions)
print(f"Después de filtrar, quedan {len(questions)} preguntas válidas")

answers = extract_answers(txt_file)
print(f"Se encontraron {len(answers)} respuestas en el solucionario")

combined_data = combine_questions_and_answers(questions, answers)

# Guardar en un archivo JSON
output_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'ccse_questions.json')
os.makedirs(os.path.dirname(output_file), exist_ok=True)

# Añadir manualmente la pregunta 3024 que falta (tiene un error en el PDF)
if '3024' in answers and '3024' not in questions:
    questions['3024'] = {
        "id": "3024",
        "question": "Los Picos de Europa están en…",
        "options": {
            "a": "Andalucía.",
            "b": "Cataluña.",  # En el PDF aparece como 'c' por error
            "c": "Asturias."
        },
        "option_count": 3,
        "type": "multiple_choice"
    }
    print("\nSe ha añadido manualmente la pregunta 3024 que faltaba (tenía un error en el PDF)")

# Recalcular combined_data después de añadir la pregunta 3024
combined_data = combine_questions_and_answers(questions, answers)

# Ordenar las preguntas por ID
combined_data.sort(key=lambda x: int(x['id']))

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(combined_data, f, ensure_ascii=False, indent=2)

print(f"Se han extraído {len(combined_data)} preguntas y respuestas en {output_file}")

# Mostrar preguntas sin respuesta
question_ids_without_answers = set(questions.keys()) - set(answers.keys())
if question_ids_without_answers:
    print(f"\nHay {len(question_ids_without_answers)} preguntas sin respuesta en el solucionario:")
    for qid in sorted(question_ids_without_answers, key=int)[:10]:  # Mostrar solo las primeras 10
        print(f"  - {qid}: {questions[qid]['question']}")
    if len(question_ids_without_answers) > 10:
        print(f"  ... y {len(question_ids_without_answers) - 10} más.")

# Mostrar respuestas sin preguntas
answer_ids_without_questions = set(answers.keys()) - set(questions.keys())
if answer_ids_without_questions:
    print(f"\nHay {len(answer_ids_without_questions)} respuestas sin pregunta correspondiente:")
    for aid in sorted(answer_ids_without_questions, key=int):
        print(f"  - {aid}: {answers[aid]}")
