Buenas noches estudiantes,

Les comparto el API para la práctica del frontend.

Repo de API: https://github.com/saurmo/mi-boleta-api

Host API: https://mi-boleta-api-y9dv.onrender.com/api/v1

Usuario Admin: juan@example.com
Pass: secret123

Adjuntos:
- Colección de Postman (en el repo del backend en la carpeta `docs`).
- Readme con el contexto del proyecto.

Notas adicionales:
- En este frontend la URL de la API se encuentra en `src/services/api.ts` (constante `API_URL`).
- Si quieres probar acciones autenticadas manualmente, puedes guardar el token en el navegador:

```javascript
localStorage.setItem('token', 'TU_TOKEN_AQUI');
```

Si quieres, puedo:
- Añadir este resumen al `README.md` del proyecto.
- Implementar que `API_URL` lea de un `.env`.
- Automatizar login con las credenciales de admin para pruebas locales.
