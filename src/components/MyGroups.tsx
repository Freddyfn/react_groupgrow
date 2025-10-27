import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Users, Target, Edit, Trash2, Eye, Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface MyGroup {
  id: string;
  name: string;
  creator: string;
  objective: string;
  currentMembers: number;
  maxMembers: number;
  targetAmount: number;
  currentAmount: number;
  category: string;
  isPublic: boolean;
  groupType: 'saving' | 'investment';
  createdAt: string;
}

export function MyGroups() {
  const navigate = useNavigate();

  // Mock data - grupos creados por el usuario actual (María González)
  const [myGroups, setMyGroups] = useState<MyGroup[]>([
    {
      id: '1',
      name: 'Ahorro para Vacaciones 2025',
      creator: 'María González',
      objective: 'Ahorrar para unas vacaciones familiares en Europa',
      currentMembers: 12,
      maxMembers: 20,
      targetAmount: 50000,
      currentAmount: 32500,
      category: 'Viajes',
      isPublic: true,
      groupType: 'saving',
      createdAt: '2024-10-15'
    },
    {
      id: '7',
      name: 'Fondo Educativo Familiar',
      creator: 'María González',
      objective: 'Crear un fondo para la educación universitaria de los hijos',
      currentMembers: 5,
      maxMembers: 8,
      targetAmount: 150000,
      currentAmount: 45000,
      category: 'Educación',
      isPublic: false,
      groupType: 'saving',
      createdAt: '2024-09-20'
    },
    {
      id: '8',
      name: 'Inversión en Acciones Tech',
      creator: 'María González',
      objective: 'Invertir en empresas tecnológicas de alto crecimiento',
      currentMembers: 10,
      maxMembers: 15,
      targetAmount: 250000,
      currentAmount: 180000,
      category: 'Inversiones',
      isPublic: true,
      groupType: 'investment',
      createdAt: '2024-08-10'
    }
  ]);

  const handleDeleteGroup = (groupId: string, groupName: string) => {
    setMyGroups(prev => prev.filter(g => g.id !== groupId));
    toast.success(`Grupo "${groupName}" eliminado exitosamente`);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Viajes': 'bg-blue-100 text-blue-800',
      'Emergencia': 'bg-red-100 text-red-800',
      'Inversiones': 'bg-green-100 text-green-800',
      'Inmuebles': 'bg-purple-100 text-purple-800',
      'Educación': 'bg-yellow-100 text-yellow-800',
      'Emprendimiento': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="mb-4">Mis Grupos</h1>
            <p className="text-muted-foreground">
              Administra los grupos que has creado
            </p>
          </div>
          <Button onClick={() => navigate('/create-group')}>
            <Plus className="mr-2 h-4 w-4" />
            Crear Nuevo Grupo
          </Button>
        </div>

        {/* Groups Grid */}
        {myGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2">
                      <Badge className={getCategoryColor(group.category)}>
                        {group.category}
                      </Badge>
                      <Badge variant="outline">
                        {group.isPublic ? 'Público' : 'Privado'}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      {group.currentMembers}/{group.maxMembers}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {group.groupType === 'saving' ? 'Grupo de Ahorro' : 'Grupo de Inversión'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-start gap-2 mb-2">
                      <Target className="h-4 w-4 mt-1 text-primary" />
                      <p className="text-sm">{group.objective}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso</span>
                      <span>
                        ${group.currentAmount.toLocaleString()} / ${group.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-secondary/30 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(group.currentAmount, group.targetAmount)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      {getProgressPercentage(group.currentAmount, group.targetAmount).toFixed(1)}% completado
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={() => navigate(`/group/${group.id}`)}
                      variant="outline"
                      className="flex-1"
                      size="sm"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver
                    </Button>
                    <Button 
                      onClick={() => navigate(`/edit-group/${group.id}`)}
                      variant="outline"
                      className="flex-1"
                      size="sm"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar grupo?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el grupo
                            "{group.name}" y todos sus datos asociados.
                            {group.currentMembers > 1 && (
                              <span className="block mt-2 text-destructive">
                                Advertencia: Este grupo tiene {group.currentMembers} miembros activos.
                              </span>
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteGroup(group.id, group.name)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">No has creado ningún grupo todavía</p>
              <p className="text-sm">Crea tu primer grupo para comenzar a ahorrar o invertir de forma colaborativa</p>
            </div>
            <Button onClick={() => navigate('/create-group')} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Crear Primer Grupo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
