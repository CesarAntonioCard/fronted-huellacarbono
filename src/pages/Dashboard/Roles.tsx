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
  getRoles,
  createRole,
  deleteRole,
  updateRole,
} from "../../api/roleApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

interface Role {
  id: number;
  nombre: string;
}

export const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [deleteRoleId, setDeleteRoleId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error("Error al obtener roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const handleCreateRole = async () => {
    if (newRoleName.trim() === "") {
      alert("El nombre del rol no puede estar vacío.");
      return;
    }
    try {
      const role = await createRole(newRoleName);
      setRoles((prev) => [...prev, role]);
      setNewRoleName("");
      setIsCreateOpen(false);
    } catch (error) {
      console.error("Error al crear rol:", error);
    }
  };

  const handleUpdateRole = async () => {
    if (editRole) {
      try {
        await updateRole(editRole.id, editRole.nombre);
        setRoles((prev) =>
          prev.map((r) => (r.id === editRole.id ? editRole : r))
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
        await deleteRole(deleteRoleId);
        setRoles((prev) => prev.filter((r) => r.id !== deleteRoleId));
        setDeleteRoleId(null);
      } catch (error) {
        console.error("Error al eliminar el rol:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Crear rol */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
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
          <DialogFooter>
            <Button onClick={handleCreateRole}>Crear</Button>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tabla de roles */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.nombre}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditRole({ ...role })}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setDeleteRoleId(role.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
                <Button size="sm" variant="secondary">
                  <FontAwesomeIcon icon={faEye} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal de editar */}
      <Dialog open={!!editRole} onOpenChange={() => setEditRole(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Rol</DialogTitle>
            <DialogDescription>
              Cambia el nombre del rol seleccionado.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={editRole?.nombre || ""}
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

      {/* Modal de confirmación de eliminación */}
      <Dialog open={!!deleteRoleId} onOpenChange={() => setDeleteRoleId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar rol?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer.
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
    </div>
  );
};
