const vscode = require('vscode');

// Lista estática de excepciones que NO deben ser cambiadas
const EXCEPCIONES_PHP = [
	'array_diff_key',
	'array_filter',
	'array_flip',
	'array_intersect_key',
	'array_key_exists',
	'array_map',
	'array_merge',
	'array_push',
	'array_reduce',
	'array_replace_recursive',
	'array_search',
	'array_slice',
	'array_unique',
	'array_unshift',
	'base_url',
	'function_exists',
	'hash_hmac',
	'in_array',
	'is_array',
	'is_numeric',
	'is_string',
	'json_decode',
	'json_encode',
	'number_format',
	'number_to_currency',
	'parse_url',
	'preg_replace',
	'str_contains',
	'str_pad',
	'str_replace',
	'str_starts_with',
	'strict_types'
    // ¡Añade aquí tus excepciones!
];

/**
 * Convierte una cadena de snake_case a camelCase, excluyendo constantes y excepciones.
 */
function toCamelCase(snakeCaseStr) {
    // 1. Manejar excepciones de la lista predefinida (siempre en minúsculas)
    if (EXCEPCIONES_PHP.includes(snakeCaseStr)) {
        return snakeCaseStr;
    }

    // 2. EXCLUIR CONSTANTES (SCREAMING_SNAKE_CASE)
    if (/^[A-Z0-9_]+$/.test(snakeCaseStr)) {
        return snakeCaseStr;
    }
    
    // 3. EXCLUIR CADENAS O CLAVES DE ARRAY EN MINÚSCULAS QUE NO TIENEN GUIONES BAJOS.
    // Esto previene que una cadena como 'id' o 'currency' sea cambiada, aunque el cambio sería nulo.
    // Lo más importante: si la cadena original no tiene guiones bajos, la devolvemos sin hacer NADA.
    if (!snakeCaseStr.includes('_')) {
        return snakeCaseStr;
    }


    // 4. Aplicar la conversión (solo si pasa los filtros 1, 2 y 3)
    return snakeCaseStr.replace(/_([a-z])/g, (match, char) => {
        return char.toUpperCase();
    });
}

/**
 * Lógica principal de la extensión para refactorizar el código seleccionado.
 */
function refactorSnakeToCamel(editor, document, selection) {
    const text = document.getText(selection);
    let newText = text;

    // --- 1. Reemplazo de Funciones (Fuera de Cadenas) ---
    // Patrón: nombre_funcion(
    const functionRegex = /([a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)+)(?=\s*\()/g;
    newText = newText.replace(functionRegex, (match) => {
        return toCamelCase(match);
    });

    // --- 2. Reemplazo de Nombres en Cadenas (SOLO COMILLAS DOBLES) ---
    // Este patrón busca snake_case dentro de comillas dobles y lo cambia.
    // Hemos eliminado la restricción de que solo busque DESPUÉS de function_exists,
    // pero aseguramos que solo busca comillas dobles.
    const quotedFunctionRegex = /(")([a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)+)(")/g;
    
    newText = newText.replace(quotedFunctionRegex, (fullMatch, quoteStart, functionName, quoteEnd) => {
        // toCamelCase ahora protege las constantes.
        const camelCaseName = toCamelCase(functionName); 
        return quoteStart + camelCaseName + quoteEnd;
    });
    
    // --- 3. Reemplazo de Variables (MANTENIENDO Claves de Array y Constantes) ---
    // Patrón: $variable_snake_case
    const variableRegex = /(\$[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)+)/g;
    
    newText = newText.replace(variableRegex, (fullMatch, variableWithDollar) => {
        const variableName = variableWithDollar.substring(1); 
        const camelCaseName = toCamelCase(variableName); 
        return '$' + camelCaseName; 
    });

    // Aplicar el reemplazo al editor
    editor.edit(editBuilder => {
        editBuilder.replace(selection, newText);
    });
}

// ... (activate y deactivate se mantienen igual)
function activate(context) {
    let disposable = vscode.commands.registerTextEditorCommand('php-snake-to-camel.refactorSelection', (editor, edit) => {
        const selection = editor.selection;

        if (selection.isEmpty) {
            vscode.window.showInformationMessage('Selecciona el código PHP que quieres refactorizar.');
            return;
        }

        try {
            refactorSnakeToCamel(editor, editor.document, selection);
        } catch (error) {
            vscode.window.showErrorMessage('Error durante la refactorización: ' + error);
        }
    });

    context.subscriptions.push(disposable);
}

exports.activate = activate;
exports.deactivate = () => {};