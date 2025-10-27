import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // <--- Integrado
import { toast } from 'sonner@2.0.3'; // <--- Integrado

export function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    riskProfile: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // <--- Integrado

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (!formData.acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    try {
      // 1. Llama al backend real (de tu primer código)
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          riskProfile: formData.riskProfile || 'moderate',
          passwordHash: formData.password,
        }),
      });

      if (response.ok) {
        // 2. Si el registro es exitoso, auto-login y notifica (de tu segundo código)
        login(formData.email, formData.password);
        toast.success('¡Registro exitoso! Bienvenido a GroupGrow.');
        navigate('/dashboard');

      } else {
        // Error del servidor (ej: email ya existe)
        const errorMessage = await response.text();
        setError(errorMessage || 'Error en el registro. Inténtalo de nuevo.');
      }
    } catch (err) {
      // Error de red
      setError('No se pudo conectar con el servidor. Revisa tu conexión.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle>Crear Cuenta</CardTitle>
          <CardDescription>
            Únete a GroupGrow y comienza a invertir en grupo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nombre *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Juan"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="lastName">Apellido *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Pérez"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="tu@email.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 234 567 8900"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="riskProfile">Perfil de Riesgo</Label>
              <Select onValueChange={(value) => handleInputChange('riskProfile', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu perfil de inversión" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservador</SelectItem>
                  <SelectItem value="moderate">Moderado</SelectItem>
                  <SelectItem value="aggressive">Agresivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="password">Contraseña *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="pl-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Repite tu contraseña"
                  className="pl-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms" 
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                Acepto los{' '}
                <Link to="/terms" className="text-primary hover:underline">
                  términos y condiciones
                </Link>
                {' '}y la{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  política de privacidad
                </Link>
              </Label>
            </div>

            <Button type="submit" className="w-full">
              Crear Cuenta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}