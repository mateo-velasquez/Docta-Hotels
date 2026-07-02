FROM golang:1.25

WORKDIR /app

COPY . .

RUN go mod download
RUN go build -o reservations-api .

EXPOSE 8086
ENV GIN_MODE=release

ENTRYPOINT ["./reservations-api"]
