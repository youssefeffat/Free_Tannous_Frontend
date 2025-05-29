import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Alert,
  Link as MuiLink,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;


const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch(
        `${backendUrl}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Erreur inconnue");
      }
  
      const token = data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ pseudo: data.pseudo, email }));
  
      // 🔽 Requête pour récupérer tous les utilisateurs
      const usersResponse = await fetch(`${backendUrl}/api/users`, {
        headers: {
          Authorization: token,
        },
      });
  
      const usersData = await usersResponse.json();
  
      if (!usersResponse.ok) {
        throw new Error(usersData.error || "Erreur lors de la récupération des utilisateurs");
      }
  
      // 🔍 Trouver l'utilisateur avec le même email
      const currentUser = usersData.find((user: any) => user.email === email);
  
      if (!currentUser) {
        throw new Error("Utilisateur non trouvé dans la liste");
      }
  
      // ✅ Stocker l'ID utilisateur
      localStorage.setItem("userId", currentUser.id);
  
      setIsError(false);
      setMessage(`Connexion réussie. Bienvenue ${data.pseudo} !`);
  
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
  
      setEmail("");
      setpassword("");
  
    } catch (err) {
      console.error("Erreur attrapée :", err);
      setIsError(true);
      setMessage((err as Error).message || "Erreur inattendue");
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleLogin}
        display="flex"
        flexDirection="column"
        gap={2}
        mt={5}
      >
        <Typography variant="h4" align="center">
          Connexion
        </Typography>

        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <TextField
          label="Mot de passe"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          required
        />

        <Button type="submit" variant="contained" color="primary">
          Se connecter
        </Button>

        {message && (
          <Alert severity={isError ? "error" : "success"}>{message}</Alert>
        )}

        <Typography align="center">
          Pas encore de compte ?{" "}
          <MuiLink component={Link} to="/signup">
            Créer un compte
          </MuiLink>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
