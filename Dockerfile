FROM python:3.11

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV FLASK_DEBUG=0

WORKDIR /usr/bin/graphylizer/src

ADD https://cdn.jsdelivr.net/npm/cytoscape@3.23.0/dist/cytoscape.min.js /usr/bin/graphylizer/src/app/static/scripts/
ADD https://cdn.jsdelivr.net/npm/cytoscape-dagre@2.5.0/cytoscape-dagre.min.js /usr/bin/graphylizer/src/app/static/scripts/
ADD https://cdn.jsdelivr.net/npm/dagre@0.8.5/dist/dagre.min.js /usr/bin/graphylizer/src/app/static/scripts/

COPY ./src/requirements.txt ./

RUN pip install -r requirements.txt

COPY ./src ./

HEALTHCHECK --interval=10s --timeout=5s --retries=5 CMD [ "curl", "localhost:80" ]

CMD gunicorn --bind 0.0.0.0:80 run:app