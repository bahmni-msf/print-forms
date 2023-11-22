FROM httpd:2.4.57-alpine

ADD target/print-forms.zip /etc/print-forms/
RUN unzip -d /usr/local/apache2/htdocs/print-forms /etc/print-forms/print-forms.zip
RUN rm -r /etc/implementer-interface
