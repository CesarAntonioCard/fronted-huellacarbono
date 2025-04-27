import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Role,
  createRole,
  deleteRole,
  restoreRole,
  getRoles,
  updateRole,
} from "../../api/roleApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faCheck } from "@fortawesome/free-solid-svg-icons";

export const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRoles, setTotalRoles] = useState(0);
  const [limit] = useState(5);

  const [newRoleName, setNewRoleName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [deleteRoleId, setDeleteRoleId] = useState<number | null>(null);
  const [restoreRoleId, setRestoreRoleId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles(currentPage, limit);
        setRoles(rolesData.roles);
        setTotalPages(rolesData.totalPages);
        setTotalRoles(rolesData.totalRoles);
      } catch (error) {
        console.error("Error al obtener roles:", error);
      }
    };

    fetchRoles();
  }, [currentPage, limit]);

  const handleCreateRole = async () => {
    if (newRoleName.trim() === "") {
      setErrorMessage("El nombre del rol no puede estar vacío.");
      return;
    }

    try {
      const role = await createRole(newRoleName);
      setRoles((prev) => [...prev, role]);

      setTotalRoles((prev) => prev + 1);
      setTotalPages(Math.ceil((totalRoles + 1) / limit));

      setNewRoleName("");
      setErrorMessage("");
      setIsCreateOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        const backendMessage =
          (error as { response?: { data: { message: string } } }).response?.data
            ?.message ?? "Error al crear rol.";
        setErrorMessage(backendMessage);
      } else {
        setErrorMessage("Error inesperado.");
      }
    }
  };

  const handleUpdateRole = async () => {
    if (editRole) {
      try {
        const updated = await updateRole(editRole.id, editRole.nombre);
        setRoles((prev) =>
          prev.map((r) => (r.id === editRole.id ? updated : r))
        );
        setEditRole(null);
      } catch (error) {
        console.error("Error al actualizar el rol:", error);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteRoleId !== null) {
      try {
        const updated = await deleteRole(deleteRoleId);
        setRoles((prev) =>
          prev.map((r) => (r.id === updated.id ? updated : r))
        );
        setDeleteRoleId(null);
      } catch (error) {
        console.error("Error al eliminar el rol:", error);
      }
    }
  };

  const handleConfirmRestore = async () => {
    if (restoreRoleId !== null) {
      try {
        const restored = await restoreRole(restoreRoleId);
        setRoles((prev) =>
          prev.map((r) => (r.id === restored.id ? restored : r))
        );
        setRestoreRoleId(null);
      } catch (error) {
        console.error("Error restaurando el rol:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Dialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) {
            setErrorMessage("");
            setNewRoleName("");
          }
        }}
      >
        <DialogTrigger asChild>
          <Button className="mb-4">Crear Rol</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Rol</DialogTitle>
            <DialogDescription>
              Escribe el nombre del nuevo rol que deseas crear.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="Nombre del rol"
          />
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          <DialogFooter>
            <Button onClick={handleCreateRole}>Crear</Button>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.nombre}</TableCell>
              <TableCell>
                <span
                  className={`font-bold ${
                    role.estado === "ACTIVO" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {role.estado}
                </span>
              </TableCell>
              <TableCell className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditRole({ ...role })}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                {role.estado === "ACTIVO" ? (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteRoleId(role.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setRestoreRoleId(role.id)}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4 space-x-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-6 py-2 rounded-md font-medium text-sm"
        >
          Anterior
        </Button>

        <span className="font-medium text-lg text-gray-700">
          Página {currentPage} de {totalPages}
        </span>

        <Button
          variant="outline"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-6 py-2 rounded-md font-medium text-sm"
        >
          Siguiente
        </Button>
      </div>
      <div className="border-t border-gray-300 my-4"></div>
      <div className="mt-4 text-lg font-semibold text-gray-800 flex justify-center items-center">
        <span>Total de roles: </span>
        <span className="text-xl text-blue-600 ml-2">{totalRoles}</span>
      </div>

      {/* Editar rol */}
      <Dialog open={!!editRole} onOpenChange={() => setEditRole(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Rol</DialogTitle>
            <DialogDescription>
              Cambia el nombre del rol seleccionado.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={editRole?.nombre ?? ""}
            onChange={(e) =>
              setEditRole((prev) =>
                prev ? { ...prev, nombre: e.target.value } : null
              )
            }
          />
          <DialogFooter>
            <Button onClick={handleUpdateRole}>Guardar</Button>
            <Button variant="outline" onClick={() => setEditRole(null)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Eliminar rol */}
      <Dialog open={!!deleteRoleId} onOpenChange={() => setDeleteRoleId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar rol?</DialogTitle>
            <DialogDescription>
              Esta acción cambiará el estado del rol a INACTIVO.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
            <Button variant="outline" onClick={() => setDeleteRoleId(null)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!restoreRoleId}
        onOpenChange={() => setRestoreRoleId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Restaurar rol?</DialogTitle>
            <DialogDescription>
              Esta acción cambiará el estado del rol a ACTIVO.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={handleConfirmRestore}>
              Restaurar
            </Button>
            <Button variant="outline" onClick={() => setRestoreRoleId(null)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
