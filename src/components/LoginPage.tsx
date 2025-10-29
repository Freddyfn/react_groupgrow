import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

// --- IMPORTS AÑADIDOS ---
import axios from 'axios'; // Usaremos axios para las llamadas API
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp'; // Componente para el código

export function LoginPage() {
  // --- ESTADOS EXISTENTES ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Función login del contexto

  // --- ESTADOS NUEVOS PARA 2FA ---
  const [show2FA, setShow2FA] = useState(false); // Controla qué pantalla mostrar (login o código)
  const [twoFACode, setTwoFACode] = useState(''); // Almacena el código 2FA ingresado
  const [pendingUserId, setPendingUserId] = useState<number | null>(null); // Guarda el ID del usuario mientras se verifica el 2FA

  /**
   * Manejador para el formulario de login inicial (email/contraseña).
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    setError(''); // Limpia errores anteriores

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      // 1. Llama al endpoint /api/auth/login del backend
      const response = await axios.post('/api/auth/login', {
        email,
        passwordHash: password, // Tu backend espera 'passwordHash'
      });

      // 2. Procesa la respuesta del backend (nuestro DTO LoginResponse)
      const { status, token, userId } = response.data;

      if (status === '2FA_REQUIRED') {
        // 2a. ¡Éxito parcial! El backend requiere verificación 2FA.
        setPendingUserId(userId); // Guarda el ID del usuario para el siguiente paso
        setShow2FA(true); // Muestra la pantalla de ingreso de código 2FA
        setPassword(''); // Borra la contraseña del estado por seguridad
      } else if (status === 'SUCCESS') {
        // 2b. ¡Éxito completo! Login directo (2FA no estaba activo o ya se verificó).
        // Extraemos datos básicos del usuario (esto debería venir del backend o token)
        const userName = email.split('@')[0]; // Simulación, obtén el nombre real
        // Llama a la función login del AuthContext para guardar el token y usuario
        login(token, { id: userId, email: email, name: userName });
        toast.success('¡Inicio de sesión exitoso!'); // Muestra notificación
        navigate('/dashboard'); // Redirige al dashboard
      } else {
        // La respuesta no fue ni SUCCESS ni 2FA_REQUIRED (puede ser FAILURE)
        setError('Credenciales inválidas. Inténtalo de nuevo.');
      }
    } catch (err: any) {
      // Error en la llamada API (ej. 400 Bad Request, 500 Server Error)
      console.error("Error en login:", err);
      if (err.response && err.response.data && typeof err.response.data === 'string') {
        setError(err.response.data); // Muestra mensaje de error del backend si existe
      } else if (err.response && err.response.data && err.response.data.status === 'FAILURE') {
         setError('Credenciales inválidas. Inténtalo de nuevo.'); // Mensaje específico para FAILURE
      }
       else {
        setError('Error al conectar con el servidor. Revisa tu conexión.');
      }
    }
  };

  /**
   * Manejador para el formulario de verificación 2FA (código OTP).
   */
  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pendingUserId) {
      setError('Error inesperado. Vuelve a iniciar sesión.');
      setShow2FA(false); // Vuelve a la pantalla de login
      return;
    }
    if (twoFACode.length !== 6) {
        setError('El código debe tener 6 dígitos.');
        return;
    }

    try {
      // 3. Llama al endpoint /api/auth/2fa/login-verify del backend
      const response = await axios.post('/api/auth/2fa/login-verify', {
        userId: pendingUserId,
        code: twoFACode
      });

      // 4. Procesa la respuesta del backend
      const { status, token, userId } = response.data;

      if (status === 'SUCCESS') {
        // 5. ¡Verificación 2FA exitosa!
        const userName = email.split('@')[0]; // Simulación
        // Llama a la función login del AuthContext
        login(token, { id: userId, email: email, name: userName });
        toast.success('¡Inicio de sesión exitoso!');
        navigate('/dashboard');
      } else {
         // Aunque el backend debería devolver error 400, por si acaso
         setError('Código 2FA incorrecto.');
         setTwoFACode(''); // Limpia el campo
      }
    } catch (err: any) {
      // Error en la llamada API (probablemente 400 Bad Request por código incorrecto)
      console.error("Error en verificación 2FA:", err);
      if (err.response && err.response.data && typeof err.response.data === 'string') {
        setError(err.response.data); // Muestra mensaje del backend
      } else {
        setError('Código 2FA incorrecto o error del servidor.');
      }
      setTwoFACode(''); // Limpia el campo en caso de error
    }
  };

  /**
   * Manejador para el enlace "¿Olvidaste tu contraseña?".
   */
  const handleForgotPassword = () => {
    // TODO: Implementar lógica real de recuperación de contraseña
    toast.info('Funcionalidad de recuperación de contraseña aún no implementada.');
  };

  // --- RENDERIZADO CONDICIONAL: PANTALLA DE 2FA ---
  if (show2FA) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Verificación de Dos Pasos</CardTitle>
            <CardDescription>
              Ingresa el código de 6 dígitos de tu aplicación autenticadora (Authy, Google Authenticator, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handle2FA} className="space-y-6">
              {/* Muestra errores específicos de la verificación 2FA */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Input para el código OTP */}
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={twoFACode}
                  onChange={(value) => setTwoFACode(value)}
                  // Estilos para centrarlo y hacerlo más grande si quieres
                  // containerClassName="justify-center"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {/* Botón para verificar el código */}
              <Button type="submit" className="w-full" disabled={twoFACode.length !== 6}>
                Verificar Código
              </Button>

              {/* Opción para volver a la pantalla de login */}
              <div className="text-center">
                <Button
                  type="button" // Importante: type="button" para no enviar el formulario
                  variant="ghost"
                  onClick={() => {
                    setShow2FA(false); // Oculta esta pantalla
                    setError(''); // Limpia errores
                    setTwoFACode(''); // Limpia el código
                    setPendingUserId(null); // Borra el ID pendiente
                  }}
                  className="text-sm"
                >
                  Volver al inicio de sesión
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- RENDERIZADO POR DEFECTO: PANTALLA DE LOGIN ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Iniciar Sesión</CardTitle>
          <CardDescription>
            Accede a tu cuenta de GroupGrow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Muestra errores del login (email/contraseña) */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Input de Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="pl-10"
                  required // Añadido para validación básica
                />
              </div>
            </div>

            {/* Input de Contraseña */}
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  className="pl-10 pr-10"
                  required // Añadido para validación básica
                />
                {/* Botón para mostrar/ocultar contraseña */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Opciones: Recordarme y Olvidé contraseña */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(val) => setRemember(val as boolean)}
                />
                <Label htmlFor="remember" className="text-sm cursor-pointer">
                  Recordarme
                </Label>
              </div>
              <Button
                type="button"
                variant="link"
                className="text-sm p-0 h-auto" // Ajustado para mejor alineación
                onClick={handleForgotPassword}
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </div>

            {/* Botón principal de Login */}
            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </form>

          {/* Enlace a Registro */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}