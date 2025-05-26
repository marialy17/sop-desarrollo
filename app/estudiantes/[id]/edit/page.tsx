"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";

const formSchema = z.object({
    nombre: z.string().min(4, {
        message: "Nombre debe tener al menos 4 caracteres",
    }),
    correo: z.string().email({
        message: "Correo no es válido",
    }),
    numMatricula: z.string().min(4, {
        message: "Número de matrícula debe tener al menos 4 caracteres",
    }),
});

export default function EditarEstudiantePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const idEstudiante = id as Id<"estudiantes">;
    const router = useRouter();
    const estudiante = useQuery(api.estudiantes.obtenerEstudiantePorId, { id: idEstudiante });
    const actualizarEstudiante = useMutation(api.estudiantes.actualizarEstudiante);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre: "",
            correo: "",
            numMatricula: "",
        },
    });

    useEffect(() => {
        if (estudiante) {
            form.reset({
                nombre: estudiante.nombre,
                correo: estudiante.correo,
                numMatricula: estudiante.numMatricula,
            });
        }
    }, [estudiante, form]);

    if (estudiante === undefined) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center gap-2 mb-6">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Skeleton className="h-8 w-64" />
                </div>
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <Skeleton className="h-8 w-full mb-2" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-10 w-24 mr-2" />
                        <Skeleton className="h-10 w-24" />
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (!estudiante) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center gap-2 mb-6">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-3xl font-bold">Estudiante no encontrado</h1>
                </div>
                <p>No se pudo encontrar el estudiante con el ID proporcionado.</p>
            </div>
        );
    }

    const handleEditarEstudiante = async (data: z.infer<typeof formSchema>) => {
        await actualizarEstudiante({
            id: estudiante._id,
            nombre: data.nombre,
            correo: data.correo,
            numMatricula: data.numMatricula,
        });
        router.push("/estudiantes");
    };

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center gap-2 mb-6">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold">Editar Estudiante</h1>
            </div>
            <Card className="max-w-2xl mx-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleEditarEstudiante)}>
                        <CardHeader>
                            <CardTitle className="font-semibold text-center">
                                Modificar información de {estudiante.nombre}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
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
                        <CardFooter className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" className="flex items-center gap-2 mt-8">
                                <Save className="h-4 w-4" />
                                Guardar Cambios
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
}