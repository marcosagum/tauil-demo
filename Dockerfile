FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html painel.html retirada.html parceiros.html fechamento.html equipe.html relatorio.html celular-retirada.html celular-app.html app.css ui.js demo.js robots.txt /usr/share/nginx/html/
EXPOSE 80
