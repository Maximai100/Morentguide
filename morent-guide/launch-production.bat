@echo off
echo �� ������ Morent Guide � �������� ������...

echo �� ��������� ������������...
call pnpm install

echo �� ������ �������...
call pnpm build

echo ✅ ������ �������� ������� �� http://localhost:4173
call pnpm preview