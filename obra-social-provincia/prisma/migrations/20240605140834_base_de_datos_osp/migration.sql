-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'PROVIDER', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "Tipo" AS ENUM ('FIDELIZADO', 'NO_FIDELIZADO');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('No_solucionado', 'Leido', 'Nuevo', 'Pendiente', 'Otros');

-- CreateEnum
CREATE TYPE "StatusMensaje" AS ENUM ('Leido', 'No_leido');

-- CreateTable
CREATE TABLE "Afiliado" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "apellido" VARCHAR(20) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "imageUrl" VARCHAR(800) NOT NULL,
    "dni" VARCHAR(8) NOT NULL,
    "phone" VARCHAR(13) NOT NULL,
    "address" VARCHAR(200),
    "coordinatesLat" INTEGER,
    "coordinatesLon" INTEGER,
    "dependencia" TEXT,
    "role" "Role" DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Afiliado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prestador" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "apellido" VARCHAR(20) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "phone" VARCHAR(13) NOT NULL,
    "checkedPhone" BOOLEAN DEFAULT false,
    "phoneOpc" VARCHAR(13),
    "imageUrl" VARCHAR(800) NOT NULL,
    "matricula" VARCHAR(5) NOT NULL,
    "especialidad" VARCHAR(100) NOT NULL,
    "especialidad2" VARCHAR(100),
    "especialidad3" VARCHAR(100),
    "descripcion" VARCHAR(600),
    "role" "Role" DEFAULT 'PROVIDER',
    "tipo" "Tipo" DEFAULT 'FIDELIZADO',
    "address" VARCHAR(200),
    "coordinatesLat" INTEGER,
    "coordinatesLon" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prestador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operador" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "apellido" VARCHAR(20) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "phone" VARCHAR(13) NOT NULL,
    "imageUrl" VARCHAR(800) NOT NULL,
    "numeroOperador" VARCHAR(5) NOT NULL,
    "role" "Role" DEFAULT 'EMPLOYEE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Operador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publicacion" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "published" TEXT NOT NULL,
    "contenido" TEXT,
    "imagen" BYTEA,
    "autorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publicacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opinion" (
    "id" SERIAL NOT NULL,
    "contenido" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opinion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Denuncia" (
    "id" SERIAL NOT NULL,
    "motivo" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "prestadorId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Nuevo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Denuncia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacion" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "receptorId" TEXT NOT NULL,
    "status" "StatusMensaje" NOT NULL DEFAULT 'No_leido',
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Afiliado_id_key" ON "Afiliado"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Afiliado_email_key" ON "Afiliado"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Afiliado_dni_key" ON "Afiliado"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Prestador_id_key" ON "Prestador"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Prestador_email_key" ON "Prestador"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Operador_id_key" ON "Operador"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Operador_email_key" ON "Operador"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Operador_numeroOperador_key" ON "Operador"("numeroOperador");

-- AddForeignKey
ALTER TABLE "Publicacion" ADD CONSTRAINT "Publicacion_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Operador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opinion" ADD CONSTRAINT "Opinion_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Afiliado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Denuncia" ADD CONSTRAINT "Denuncia_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Afiliado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Denuncia" ADD CONSTRAINT "Denuncia_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "Prestador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Operador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_receptorId_fkey" FOREIGN KEY ("receptorId") REFERENCES "Afiliado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
