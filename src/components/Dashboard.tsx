import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Plus, 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  Calendar,
  Bot,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { MarkdownFormatter } from './MarkdownFormatter';

// Interfaces para tipado
interface DashboardStats {
  totalSaved: number;
  totalInvested: number;
  monthlyGrowth: number;
  activeGroups: number;
  nextPaymentAmount: number;
  nextPaymentDays: number;
}

interface PerformanceDataPoint {
  month: string;
  amount: number;
}

interface PortfolioItem {
  name: string;
  value: number;
  color: string;
}

interface UserGroup {
  id: number;
  name: string;
  members: number;
  target: number;
  current: number;
  monthlyContribution: number;
  deadline: string;
  status: string;
}

interface DashboardData {
  stats: DashboardStats;
  performance: PerformanceDataPoint[];
  portfolio: PortfolioItem[];
  groups: UserGroup[];
  aiTips: string[];
}

export function Dashboard() {
  const { user } = useAuth();
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) {
      setError('No hay usuario logueado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/dashboard/${user.id}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Error al cargar los datos del dashboard');
      }
      const data: DashboardData = await response.json();
      setDashboardData(data);
    } catch (err: any) {
      setError(err.message);
      toast.error('No se pudieron cargar tus datos. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Cargando tu dashboard...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-screen">
        <p className="text-lg text-destructive">Error al cargar los datos. Por favor, recarga la página.</p>
      </div>
    );
  }

  const { stats, performance, portfolio, groups, aiTips } = dashboardData;

  // Calcular el crecimiento de ahorros comparando los últimos dos meses
  const calculateSavingsGrowth = () => {
    if (performance.length < 2) return null;
    const lastMonth = performance[performance.length - 1].amount;
    const previousMonth = performance[performance.length - 2].amount;
    
    if (previousMonth === 0) {
      return lastMonth > 0 ? '+100' : null;
    }
    
    const growth = ((lastMonth - previousMonth) / previousMonth) * 100;
    return growth >= 0 ? `+${growth.toFixed(1)}` : growth.toFixed(1);
  };

  // Calcular cuántos grupos necesitan atención
  const calculateGroupsNeedingAttention = () => {
    if (groups.length === 0) return 0;
    
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return groups.filter(group => {
      // Grupos con voto pendiente
      if (group.status === 'pending_vote') return true;
      
      // Grupos con deadline cercano (menos de 7 días)
      const deadline = new Date(group.deadline);
      if (deadline <= sevenDaysFromNow && deadline >= now) return true;
      
      return false;
    }).length;
  };

  const savingsGrowth = calculateSavingsGrowth();
  const groupsNeedingAttention = calculateGroupsNeedingAttention();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl mb-2">Mi Dashboard</h1>
          <p className="text-muted-foreground">
            Administra tus inversiones y grupos de ahorro
          </p>
        </div>
        <Button asChild>
          <Link to="/create-group">
            <Plus className="mr-2 h-4 w-4" />
            Crear Grupo
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Ahorrado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${stats.totalSaved.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {savingsGrowth !== null 
                ? `${savingsGrowth}% desde el mes pasado`
                : stats.totalSaved > 0 
                  ? 'Comienza tu historial de ahorro'
                  : 'Aún no has realizado ahorros'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Invertido</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${stats.totalInvested.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.monthlyGrowth !== 0 
                ? `${stats.monthlyGrowth >= 0 ? '+' : ''}${stats.monthlyGrowth.toFixed(1)}% este mes`
                : stats.totalInvested > 0
                  ? 'Sin cambios este mes'
                  : 'Aún no has realizado inversiones'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Grupos Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.activeGroups}</div>
            <p className="text-xs text-muted-foreground">
              {groupsNeedingAttention > 0
                ? `${groupsNeedingAttention} ${groupsNeedingAttention === 1 ? 'necesita' : 'necesitan'} tu atención`
                : stats.activeGroups > 0
                  ? 'Todos tus grupos están al día'
                  : 'Únete o crea un grupo para empezar'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Próximo Pago</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {stats.nextPaymentAmount > 0 
                ? `$${stats.nextPaymentAmount.toLocaleString()}`
                : '$0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.nextPaymentAmount > 0 && stats.nextPaymentDays > 0
                ? `En ${stats.nextPaymentDays} ${stats.nextPaymentDays === 1 ? 'día' : 'días'}`
                : stats.nextPaymentAmount > 0 && stats.nextPaymentDays === 0
                  ? 'Vence hoy'
                  : 'No hay pagos pendientes'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolución de Ahorros</CardTitle>
            <CardDescription>
              Tu progreso de ahorro en los últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución de Portfolio</CardTitle>
            <CardDescription>
              Cómo están distribuidas tus inversiones
            </CardDescription>
          </CardHeader>
          <CardContent>
            {portfolio && portfolio.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={portfolio}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={true}
                    >
                      {portfolio.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {portfolio.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No hay datos de portfolio disponibles
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Groups Section */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Grupos de Inversión</CardTitle>
          <CardDescription>
            Gestiona tus grupos de ahorro e inversión
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {groups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tienes grupos todavía. ¡Crea uno para empezar!
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{group.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Users className="w-4 h-4 mr-1" />
                      {group.members} miembros
                      <Target className="w-4 h-4 mr-1 ml-3" />
                      Meta: ${group.target.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {group.status === 'pending_vote' && (
                      <Badge variant="destructive">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Voto Pendiente
                      </Badge>
                    )}
                    <Badge variant={group.status === 'active' ? 'default' : 'secondary'}>
                      {group.status === 'active' ? 'Activo' : 'Pendiente'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso: ${group.current.toLocaleString()}</span>
                    <span>{Math.round((group.current / group.target) * 100)}%</span>
                  </div>
                  <Progress value={(group.current / group.target) * 100} />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Aporte mensual: ${group.monthlyContribution}</span>
                    <span>Vence: {new Date(group.deadline).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex justify-end mt-3">
                  <Button variant="outline" asChild>
                    <Link to={`/group/${group.id}`}>
                      Ver Detalles
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* AI Assistant */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="w-5 h-5 mr-2 text-primary" />
              <CardTitle>Asistente IA</CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAIAssistant(!showAIAssistant)}
            >
              {showAIAssistant ? 'Ocultar' : 'Mostrar'} Consejos
            </Button>
          </div>
          <CardDescription>
            Recomendaciones personalizadas para optimizar tus inversiones
          </CardDescription>
        </CardHeader>
        {showAIAssistant && (
          <CardContent>
            <div className="space-y-3">
              {aiTips.map((tip, index) => (
                <div key={index} className="flex items-start p-3 bg-muted/50 rounded-lg">
                  <Bot className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <MarkdownFormatter text={tip} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
