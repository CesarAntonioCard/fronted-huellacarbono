import { useCallback, useEffect, useState } from "react";
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
import { PaginationBar } from "@/components/PaginationBar";

export const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRoles, setTotalRoles] = useState(0);
  const [limit] = useState(5);

  const [formError, setFormError] = useState("");

  const [newRoleName, setNewRoleName] = useState("");

  const [editRole, setEditRole] = useState<Role | null>(null);
  const [deleteRoleId, setDeleteRoleId] = useState<number | null>(null);
  const [restoreRoleId, setRestoreRoleId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [nameFilter, setNameFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");

  const fetchRoles = useCallback(
    async (page: number = currentPage) => {
      try {
        const rolesData = await getRoles(page, limit, nameFilter, estadoFilter);
        setRoles(rolesData.roles);
        setTotalPages(rolesData.totalPages);
        setTotalRoles(rolesData.totalRoles);
      } catch (error) {
        console.error("Error al obtener roles:", error);
      }
    },
    [currentPage, limit, nameFilter, estadoFilter]
  );

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleCreateRole = async () => {
    setFormError("");

    try {
      if (newRoleName.trim() === "") {
        throw new Error("El nombre del rol no puede estar vacío.");
      }

      await createRole(newRoleName);
      setNewRoleName("");
      setIsCreateOpen(false);
      setCurrentPage(1);
      fetchRoles(1);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error en rol:", error);
      setFormError(error.message ?? "Error desconocido");
      setTimeout(() => {
        setFormError("");
      }, 2000);
    }
  };

  const handleUpdateRole = async () => {
    if (editRole) {
      setFormError("");
      try {
        const updated = await updateRole(editRole.id, editRole.nombre);
        setRoles((prev) =>
          prev.map((r) => (r.id === editRole.id ? updated : r))
        );
        setEditRole(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Error en rol:", error);
        setFormError(error.message ?? "Error desconocido");
        setTimeout(() => {
          setFormError("");
        }, 2000);
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
          {formError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">
              {formError}
            </div>
          )}
          <Input
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="Nombre del rol"
          />
          <DialogFooter>
            <Button onClick={handleCreateRole}>Crear</Button>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mb-4 flex flex-col md:flex-row flex-wrap gap-4">
        <div className="w-full md:w-auto">
          <input
            type="text"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Filtrar por nombre"
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="w-full md:w-auto">
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Filtrar por estado</option>
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
          </select>
        </div>
      </div>

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

      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalRoles}
        label="roles"
        onPageChange={setCurrentPage}
      />

      {/* Editar rol */}
      <Dialog open={!!editRole} onOpenChange={() => setEditRole(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Rol</DialogTitle>
            <DialogDescription>
              Cambia el nombre del rol seleccionado.
            </DialogDescription>
          </DialogHeader>
          {formError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">
              {formError}
            </div>
          )}
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

      {/* Restaurar rol */}
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
