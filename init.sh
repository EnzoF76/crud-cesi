#!/bin/bash
sleep 5
#npx prisma init
#npx prisma migrate dev --name init
npx prisma generate
npx prisma db push
node ./index.js