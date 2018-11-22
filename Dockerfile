# Stage 0, "build-stage", based on Node.js, to build and compile Angular
FROM nginx:1.14.0 as nginx 
RUN rm -rf /usr/share/nginx/html/*    
COPY dist /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/console/*
RUN rm -rf /usr/share/nginx/html/charges/*
RUN rm -rf /usr/share/nginx/html/docket/*
RUN mkdir -p /usr/share/nginx/html/resources
RUN mkdir -p /usr/share/nginx/html/resources/bootstrap
RUN mkdir -p /usr/share/nginx/html/resources/bootstrap/fonts
RUN mkdir -p /usr/share/nginx/html/resources/css
RUN mkdir -p /usr/share/nginx/html/resources/css/fonts
RUN mkdir -p /usr/share/nginx/html/resources/images
RUN mkdir -p /usr/share/nginx/html/resources/img
RUN mkdir -p /usr/share/nginx/html/resources/js
RUN mkdir -p /usr/share/nginx/html/resources/lendingbox
RUN mkdir -p /usr/share/nginx/html/resources/INDB
RUN mkdir -p /usr/share/nginx/html/resources/INDB/fonts
COPY evolvus-sandstorm-ng-ui/dist/ui-console /usr/share/nginx/html/console
COPY evolvus-sandstorm-ng-ui/src/not-found.component.html /usr/share/nginx/html/console
COPY evolvus-charges-ng-ui/dist/ui-charges /usr/share/nginx/html/charges
COPY evolvus-docket-ng-ui/dist /usr/share/nginx/html/docket



CMD ["nginx", "-g", "daemon off;"]
