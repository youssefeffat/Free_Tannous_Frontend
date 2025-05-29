import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Alert,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Signup: React.FC = () => {
  const [pseudo, setpseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${backendUrl}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pseudo, email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur inconnue");
      }

      setIsError(false);
      setMessage(data.message || "Inscription réussie !");
      setpseudo("");
      setEmail("");
      setpassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error("Erreur attrapée par catch:", err);
      setIsError(true);
      setMessage((err as Error).message || "Erreur inattendue");
    }
  };

  return (
    <Container maxWidth="sm">
      {/* En-tête avec flèche + titre centré */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        mt={4}
        mb={2}
        position="relative"
      >
        <IconButton
          onClick={() => navigate("/login")}
          edge="start"
          sx={{ position: "absolute", left: 0 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" align="center">
          Créer un compte
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <TextField
          label="Pseudo"
          variant="outlined"
          fullWidth
          value={pseudo}
          onChange={(e) => setpseudo(e.target.value)}
          required
        />

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          type="email"
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

        <Button variant="contained" color="primary" type="submit">
          S'inscrire
        </Button>

        {message && (
          <Alert severity={isError ? "error" : "success"}>{message}</Alert>
        )}
      </Box>
    </Container>
  );
};

export default Signup;
