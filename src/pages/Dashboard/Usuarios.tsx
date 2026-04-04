import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";

import { User, deleteUser, restoreUser, getUsers } from "../../api/userApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faCheck } from "@fortawesome/free-solid-svg-icons";
import { PaginationBar } from "@/components/PaginationBar";

export const Usuarios = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit] = useState(5);

  const [nameFilter, setNameFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");

  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [restoreUserId, setRestoreUserId] = useState<number | null>(null);

  const fetchUsers = useCallback(
    async (page: number = currentPage) => {
      try {
        const usersData = await getUsers(
          page,
          limit,
          nameFilter,
          estadoFilter,
          emailFilter,
        );
        setUsers(usersData.users);
        setTotalPages(usersData.totalPages);
        setTotalUsers(usersData.totalUsers);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    },
    [currentPage, limit, nameFilter, estadoFilter, emailFilter],
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleConfirmDelete = async () => {
    if (deleteUserId !== null) {
      try {
        const updated = await deleteUser(deleteUserId);
        setUsers((prev) =>
          prev.map((r) => (r.id === updated.id ? updated : r)),
        );
        setDeleteUserId(null);
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
      }
    }
  };

  const handleConfirmRestore = async () => {
    if (restoreUserId !== null) {
      try {
        const restored = await restoreUser(restoreUserId);
        setUsers((prev) =>
          prev.map((r) => (r.id === restored.id ? restored : r)),
        );
        setRestoreUserId(null);
      } catch (error) {
        console.error("Error restaurando el usuario:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
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
          <input
            type="text"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            placeholder="Filtrar por email"
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
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.nombre_completo}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.rol}</TableCell>
              <TableCell>
                <span
                  className={`font-bold ${
                    user.estado === "ACTIVO" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {user.estado}
                </span>
              </TableCell>
              <TableCell className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  // onClick={() => setEditRole({ ...role })}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                {user.estado === "ACTIVO" ? (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteUserId(user.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setRestoreUserId(user.id)}
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
        totalItems={totalUsers}
        label="usuarios"
        onPageChange={setCurrentPage}
      />

      {/* Eliminar usuario */}
      <Dialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar usuario?</DialogTitle>
            <DialogDescription>
              Esta acción cambiará el estado del usuario a INACTIVO.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
            <Button variant="outline" onClick={() => setDeleteUserId(null)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restaurar usuario */}
      <Dialog
        open={!!restoreUserId}
        onOpenChange={() => setRestoreUserId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Restaurar usuario?</DialogTitle>
            <DialogDescription>
              Esta acción cambiará el estado del usuario a ACTIVO.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={handleConfirmRestore}>
              Restaurar
            </Button>
            <Button variant="outline" onClick={() => setRestoreUserId(null)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
