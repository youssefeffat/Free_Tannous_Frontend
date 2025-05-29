import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface User {
  id: string;
  username: string;
  email: string;
}

const getToken = (): string | null => {
  const raw = localStorage.getItem('token');
  return raw?.replace(/^'|'$/g, '') || null;
};

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = getToken();
    if (!token) {
      setError("Aucun token trouvé. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/api/users`, {
        headers: {
          Authorization: token,
        },
      });

      const data = await res.json();

      console.log("Utilisateurs récupérés :", data);

      if (!res.ok) throw new Error(data.error || 'Erreur lors du chargement des utilisateurs');

      setUsers(data);
    } catch (err) {
      console.error("Erreur lors du fetch :", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (user_id: string) => {
    const token = getToken();
    if (!token) {
      setError("Aucun token trouvé. Veuillez vous reconnecter.");
      return;
    }

    const user = users.find(u => u.id === user_id);
    if (!user) {
      console.error("Utilisateur introuvable dans la liste !");
      return;
    }

    console.log("ID de l'utilisateur à supprimer :", user.id);

    try {
      const res = await fetch(`${backendUrl}/api/admin`, {
        method: 'POST',
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_id: user.id }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Erreur lors de la suppression');

      console.log("Suppression réussie :", data);

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setSuccessMessage(`Utilisateur "${user.username}" supprimé avec succès`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      setError((err as Error).message);
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>Gestion des utilisateurs</Typography>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        {!loading && !error && (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Nom d'utilisateur</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="error"
                        onClick={() => {
                          console.log("Bouton suppression cliqué pour :", user);
                          deleteUser(user.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      Aucun utilisateur trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default AdminUsers;

const backendUrl = process.env.REACT_APP_BACKEND_URL;
