#!/bin/bash
sleep 5
npx prisma generate
npx prisma db push
node ./index.js