# SD Project Frontend

Frontend React + TypeScript + Vite para a plataforma Nhluvuko.

## Ambiente

Cria um ficheiro `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Variável obrigatória:

```bash
VITE_API_URL=https://api.example.com
```

## Desenvolvimento

```bash
npm ci
npm run dev
```

## Produção

```bash
npm run lint
npm run build
npm run preview
```

O artefacto de produção fica em `dist/`.
