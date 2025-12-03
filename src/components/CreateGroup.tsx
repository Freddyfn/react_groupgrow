import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, Users, Target, DollarSign, Clock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { groupService } from '../services/groupService';

// Simple date formatter
const formatDate = (date: Date) => {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export function CreateGroup() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    groupName: '',
    groupType: undefined as 'saving' | 'investment' | undefined, // 'investment' or 'saving'
    description: '',
    goal: '',
    targetAmount: '',
    deadline: undefined as Date | undefined,
    maxMembers: '',
    privacy: undefined as 'public' | 'private' | undefined, // 'public' or 'private'
    contributionFrequency: undefined as string | undefined, // 'weekly', 'monthly', 'quarterly'
    minimumContribution: '',
    riskLevel: undefined as 'low' | 'medium' | 'high' | undefined, // 'low', 'medium', 'high'
    category: undefined as string | undefined // 'education', 'travel', 'emergency', 'retirement', 'business', 'other'
  });
  const [error, setError] = useState('');

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para crear grupos');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Verificar autenticación
    if (!isAuthenticated || !user) {
      setError('Debes estar autenticado para crear grupos');
      toast.error('Debes iniciar sesión para crear grupos');
      return;
    }

    // Validación mejorada con mensajes específicos
    const missingFields: string[] = [];

    if (!formData.groupName || formData.groupName.trim() === '') {
      missingFields.push('Nombre del Grupo');
    }

    if (!formData.groupType) {
      missingFields.push('Tipo de Grupo');
    }

    if (!formData.goal || formData.goal.trim() === '') {
      missingFields.push('Meta Específica');
    }

    if (!formData.targetAmount || formData.targetAmount.trim() === '') {
      missingFields.push('Monto Objetivo');
    } else {
      const targetAmountNum = parseFloat(formData.targetAmount);
      if (isNaN(targetAmountNum) || targetAmountNum <= 0) {
        setError('El monto objetivo debe ser un número mayor a 0');
        return;
      }
    }

    if (missingFields.length > 0) {
      setError(`Por favor completa los siguientes campos obligatorios: ${missingFields.join(', ')}`);
      return;
    }

    if (formData.maxMembers && formData.maxMembers.trim() !== '' && parseInt(formData.maxMembers) < 2) {
      setError('El grupo debe tener al menos 2 miembros');
      return;
    }

    // Crear grupo en el backend
    try {
      const createdGroup = await groupService.createGroup({
        name: formData.groupName.trim(),
        type: formData.groupType as 'saving' | 'investment',
        description: formData.description && formData.description.trim() !== '' ? formData.description.trim() : undefined,
        goal: formData.goal.trim(),
        targetAmount: parseFloat(formData.targetAmount),
        deadline: formData.deadline?.toISOString().split('T')[0],
        maxMembers: formData.maxMembers && formData.maxMembers.trim() !== '' ? parseInt(formData.maxMembers) : undefined,
        privacy: formData.privacy || 'public',
        contributionFrequency: formData.contributionFrequency || undefined,
        minimumContribution: formData.minimumContribution && formData.minimumContribution.trim() !== '' ? parseFloat(formData.minimumContribution) : undefined,
        riskLevel: formData.riskLevel || undefined,
        category: formData.category || undefined
      });

      toast.success(`Grupo "${formData.groupName}" creado exitosamente`);
      navigate('/my-groups');
    } catch (error: any) {
      console.error('Error al crear grupo:', error);
      setError(error.response?.data?.message || 'Error al crear el grupo');
      toast.error(error.response?.data?.message || 'Error al crear el grupo');
    }
  };

  const groupCategories = [
    { value: 'education', label: 'Educación' },
    { value: 'travel', label: 'Viajes' },
    { value: 'emergency', label: 'Fondo de Emergencia' },
    { value: 'retirement', label: 'Jubilación' },
    { value: 'business', label: 'Negocio' },
    { value: 'home', label: 'Vivienda' },
    { value: 'health', label: 'Salud' },
    { value: 'other', label: 'Otro' }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/my-groups')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Mis Grupos
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Crear Nuevo Grupo
              </CardTitle>
              <CardDescription>
                Define los objetivos y reglas para tu grupo de inversión o ahorro
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Información Básica */}
                <div className="space-y-4">
                  <h3 className="text-lg">Información Básica</h3>

                  <div>
                    <Label htmlFor="groupName">Nombre del Grupo *</Label>
                    <Input
                      id="groupName"
                      value={formData.groupName}
                      onChange={(e) => handleInputChange('groupName', e.target.value)}
                      placeholder="Ej: Ahorro para Vacaciones 2025"
                    />
                  </div>

                  <div>
                    <Label>Tipo de Grupo *</Label>
                    <RadioGroup
                      value={formData.groupType || ''}
                      onValueChange={(value) => handleInputChange('groupType', value as 'saving' | 'investment')}
                      className="flex space-x-6 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="saving" id="saving" />
                        <Label htmlFor="saving">Ahorro</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="investment" id="investment" />
                        <Label htmlFor="investment">Inversión</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe el propósito y objetivos del grupo..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Categoría</Label>
                    <Select
                      value={formData.category || undefined}
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {groupCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Objetivos Financieros */}
                <div className="space-y-4">
                  <h3 className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Objetivos Financieros
                  </h3>

                  <div>
                    <Label htmlFor="goal">Meta Específica *</Label>
                    <Input
                      id="goal"
                      value={formData.goal}
                      onChange={(e) => handleInputChange('goal', e.target.value)}
                      placeholder="Ej: Comprar un auto, Viaje a Europa, Fondo de emergencia"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="targetAmount">Monto Objetivo * ($)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="targetAmount"
                          type="number"
                          value={formData.targetAmount}
                          onChange={(e) => handleInputChange('targetAmount', e.target.value)}
                          placeholder="50000"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="deadline">Fecha Límite</Label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="deadline"
                          type="date"
                          value={formData.deadline ? formData.deadline.toISOString().split('T')[0] : ''}
                          onChange={(e) => {
                            const dateValue = e.target.value;
                            if (dateValue) {
                              const date = new Date(dateValue);
                              handleInputChange('deadline', date);
                            } else {
                              handleInputChange('deadline', undefined);
                            }
                          }}
                          className="pl-10"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contributionFrequency">Frecuencia de Aportes</Label>
                      <Select
                        value={formData.contributionFrequency || undefined}
                        onValueChange={(value) => handleInputChange('contributionFrequency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="monthly">Mensual</SelectItem>
                          <SelectItem value="quarterly">Trimestral</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="minimumContribution">Aporte Mínimo ($)</Label>
                      <Input
                        id="minimumContribution"
                        type="number"
                        value={formData.minimumContribution}
                        onChange={(e) => handleInputChange('minimumContribution', e.target.value)}
                        placeholder="100"
                      />
                    </div>
                  </div>

                  {formData.groupType === 'investment' && (
                    <div>
                      <Label>Nivel de Riesgo</Label>
                      <RadioGroup
                        value={formData.riskLevel || ''}
                        onValueChange={(value) => handleInputChange('riskLevel', value as 'low' | 'medium' | 'high')}
                        className="flex space-x-6 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="low" id="low" />
                          <Label htmlFor="low">Bajo</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium">Medio</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="high" id="high" />
                          <Label htmlFor="high">Alto</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                </div>

                {/* Configuración del Grupo */}
                <div className="space-y-4">
                  <h3 className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Configuración del Grupo
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxMembers">Número Máximo de Miembros</Label>
                      <Input
                        id="maxMembers"
                        type="number"
                        value={formData.maxMembers}
                        onChange={(e) => handleInputChange('maxMembers', e.target.value)}
                        placeholder="10"
                        min="2"
                        max="50"
                      />
                    </div>

                    <div>
                      <Label>Privacidad</Label>
                      <RadioGroup
                        value={formData.privacy || ''}
                        onValueChange={(value) => handleInputChange('privacy', value as 'public' | 'private')}
                        className="flex space-x-6 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="public" id="public" />
                          <Label htmlFor="public">Público</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="private" id="private" />
                          <Label htmlFor="private">Privado</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-6">
                  <Button type="submit" className="flex-1">
                    Crear Grupo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/my-groups')}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}