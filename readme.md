# PHP cambia de snake_case a camelCame

Una extensión simple y eficiente para Visual Studio Code que te permite cambiar las variables y funciones de tipo snake_case a camelCase.

---

## Características

- **Cambio de estructura:** Cambia los nombres de las variables/funciones de snake_case a camelCase.
- **Sencillo de usar:** Cambia el código con un solo comando.

---

## Uso

1.  **Selecciona el código:** Resalta el código de PHP que deseas cambiar en tu editor. El código debe ser la palabra completa que contega internamente `_`.
2.  **Abre la Paleta de Comandos:** Presiona `Ctrl+Shift+P` (o `Cmd+Shift+P` en macOS).
3.  **Ejecuta el comando:** Escribe `PHP snake_case a camelCase` y selecciona el comando que aparece.

El código seleccionado se cambiará automáticamente.

---

## Ejemplo

### Antes

```php
[
    'record_status' => $record_status,
	'data_view' => [
		'data' => $this->subtb_1->paymentsWithConsolidation($this->user_session->user_id, $record_status),
        'archived' => $this->tb->countArchived(['user_id' => $this->user_session->user_id]),
        'consolidations' => $this->tb->consolidationsWithOrders($this->user_session->user_id, $record_status),
		'actived' => $this->tb->countActived(['user_id' => $this->user_session->user_id])
    ]
]
```

### Después

```php
[   'recordStatus' => $recordStatus,
    'dataView' => [
        'data' => $this->subtb1->paymentsWithConsolidation($this->userSession->userId, $recordStatus)
        'archived' => $this->tb->countArchived(['userId' => $this->userSession->userId]),
        'consolidations' => $this->tb->consolidationsWithOrders($this->userSession->userId, $recordStatus),
        'actived' => $this->tb->countActived(['userId' => $this->userSession->userId])
    ]
]
```

---

## Instalación

- Abre Visual Studio Code.
- Ve a la vista de Extensiones `Ctrl+Shift+X`.
- Busca `PHP snake_case a camelCase`.
- Haz clic en **Instalar**.

---

## Contribuciones

Si encuentras un error o tienes una sugerencia, no dudes en abrir un "issue" o enviar un "pull request" en el repositorio de GitHub.

---

### Autor: **Lord Dark Dmonium**
