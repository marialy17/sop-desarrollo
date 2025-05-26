"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  numMatricula: z.string().min(4, {
    message: "Número de matrícula debe tener al menos 4 caracteres",
  }),
  nombre: z.string().min(4, {
    message: "Nombre debe tener al menos 4 caracteres",
  }),
  correo: z.string().email({
    message: "Correo no válido",
  }),
});

export default function CrearEstudiantePage() {
  const router = useRouter();
  const crearEstudiante = useMutation(api.estudiantes.crearEstudiante);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numMatricula: "",
      nombre: "",
      correo: "",
    },
  });

  const handleNuevoEstudiante = async (data: z.infer<typeof formSchema>) => {
    await crearEstudiante({
      numMatricula: data.numMatricula,
      nombre: data.nombre,
      correo: data.correo,
    });
    form.reset();
    router.push("/estudiantes");
  };

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-10 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Crear Nuevo Estudiante
          </h1>
        </div>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleNuevoEstudiante)}>
            <CardHeader>
              <CardTitle className="font-semibold text-center">Información del Estudiante</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="numMatricula"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Matrícula</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: A12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del estudiante" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="correo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="correo@ejemplo.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto"
              >
                Crear Estudiante
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}