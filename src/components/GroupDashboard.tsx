import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { 
  Users, 
  Target, 
  DollarSign, 
  Calendar,
  TrendingUp,
  Vote,
  Clock,
  AlertCircle,
  CheckCircle,
  Bot,
  Download,
  MessageSquare,
  CreditCard,
  LogOut,
  Wallet,
  Lock,
  Unlock
} from 'lucide-react';
import { toast } from 'sonner';
import { MarkdownFormatter } from './MarkdownFormatter';

// Interfaces
interface Member {
  id: number;
  name: string;
  avatar: string;
  contribution: number;
  status: string;
}

interface PerformanceData {
  month: string;
  amount: number;
  target: number;
}

interface Transaction {
  id: number;
  type: string;
  amount: number;
  member?: string;
  description?: string;
  date: string;
  status: string;
}

interface ActiveVoting {
  id: number;
  title: string;
  description: string;
  amount: number;
  votesFor: number;
  votesAgainst: number;
  totalMembers: number;
  deadline: string;
  details: string;
}

interface GroupData {
  id: string;
  name: string;
  description: string;
  type: string;
  target: number;
  current: number;
  monthlyContribution: number;
  deadline: string;
  investmentTerm?: string;
  status: string;
  userContribution: number;
  userProfits: number;
  totalProfits: number;
  members: Member[];
  performance: PerformanceData[];
  transactions: Transaction[];
  activeVoting?: ActiveVoting | null;
}

export function GroupDashboard() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ days: 15, hours: 8, minutes: 42 });
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [withdrawType, setWithdrawType] = useState<'savings' | 'profits'>('savings');
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  const fetchGroupData = async () => {
    if (!groupId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Debes iniciar sesión para ver el grupo');
        navigate('/login');
        return;
      }

      const response = await fetch(`/api/v1/groups/${groupId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar los datos del grupo');
      }
      const data: GroupData = await response.json();
      setGroupData(data);
    } catch (err: any) {
      setError(err.message);
      toast.error('Error al cargar los datos del grupo.');
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59 };
        }
        return prev;
      });
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleVote = (vote: 'for' | 'against') => {
    alert(`Has votado ${vote === 'for' ? 'a favor' : 'en contra'} de la propuesta`);
    setShowVotingModal(false);
  };

  const handlePayment = () => {
    navigate(`/make-payment/${groupId}`);
  };

  const downloadReport = (format: string) => {
    alert(`Descargando reporte en formato ${format.toUpperCase()}...`);
  };

  // Verificar si se puede retirar la inversión (después del plazo)
  const canWithdrawInvestment = () => {
    if (!groupData) return false;
    if (groupData.type === 'savings') return true;
    if (!groupData.investmentTerm) return false;
    const currentDate = new Date();
    const termDate = new Date(groupData.investmentTerm);
    return currentDate >= termDate;
  };

  const handleWithdraw = (type: 'savings' | 'profits') => {
    setWithdrawType(type);
    setShowWithdrawDialog(true);
  };

  const confirmWithdraw = () => {
    if (!groupData) return;
    if (withdrawType === 'savings') {
      alert(`Retirando tu ${groupData.type === 'savings' ? 'ahorro' : 'inversión'}: ${groupData.userContribution.toLocaleString()}`);
    } else {
      alert(`Retirando tus ganancias: ${groupData.userProfits.toLocaleString()}`);
    }
    setShowWithdrawDialog(false);
  };

  const askAI = async () => {
    if (!aiQuestion.trim() || !groupId) return;
    
    setAiLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/v1/ai/ask/group/${groupId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ question: aiQuestion })
      });

      if (!response.ok) {
        throw new Error('Error al consultar al asistente IA');
      }

      const data = await response.json();
      setAiAnswer(data.answer || 'No se pudo obtener una respuesta');
      setAiQuestion(''); // Limpiar la pregunta
    } catch (error: any) {
      setAiAnswer('Error: ' + (error.message || 'No se pudo conectar con el asistente IA'));
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Cargando datos del grupo...</p>
      </div>
    );
  }

  if (error || !groupData) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-screen">
        <p className="text-lg text-destructive">Error al cargar los datos del grupo.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl mb-2">{groupData.name}</h1>
          <p className="text-muted-foreground">{groupData.description}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => downloadReport('pdf')}>
            <Download className="mr-2 h-4 w-4" />
            Reporte PDF
          </Button>
          <Button onClick={handlePayment}>
            <CreditCard className="mr-2 h-4 w-4" />
            Realizar Pago
          </Button>
        </div>
      </div>

      {/* Active Voting Alert */}
      {groupData.activeVoting && (
        <Alert className="border-orange-200 bg-orange-50">
          <Vote className="h-4 w-4" />
          <AlertDescription>
            <div className="flex justify-between items-center">
              <div>
                <strong>Votación Activa:</strong> {groupData.activeVoting.title}
                <br />
                <span className="text-sm">
                  Votos: {groupData.activeVoting.votesFor} a favor, {groupData.activeVoting.votesAgainst} en contra
                </span>
              </div>
              <Button onClick={() => setShowVotingModal(true)}>
                Votar Ahora
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">
              {groupData.type === 'savings' ? 'Ahorros Actuales' : 'Inversión Actual'}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${groupData.current.toLocaleString()}</div>
            {groupData.type === 'investment' && groupData.totalProfits > 0 && (
              <div className="text-sm text-green-600">
                +${groupData.totalProfits.toLocaleString()} en ganancias
              </div>
            )}
            <div className="mt-2">
              <Progress value={(groupData.current / groupData.target) * 100} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((groupData.current / groupData.target) * 100)}% de la meta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Meta del Grupo</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${groupData.target.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Faltan ${(groupData.target - groupData.current).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Miembros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{groupData.members.length}</div>
            <p className="text-xs text-muted-foreground">
              {groupData.members.filter(m => m.status === 'late').length} con retraso en pago
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">
              {groupData.type === 'investment' ? 'Plazo de Inversión' : 'Tiempo Restante'}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {groupData.type === 'investment' ? (
              <div>
                <div className="text-lg">
                  {canWithdrawInvestment() ? 'Disponible' : `${timeLeft.days}d ${timeLeft.hours}h`}
                </div>
                <p className="text-xs text-muted-foreground">
                  {canWithdrawInvestment() ? 
                    'Inversión lista para retiro' : 
                    'Hasta poder retirar inversión'}
                </p>
                {canWithdrawInvestment() && (
                  <Badge variant="default" className="mt-1 text-xs bg-green-600">
                    <Unlock className="w-3 h-3 mr-1" />
                    Desbloqueado
                  </Badge>
                )}
              </div>
            ) : (
              <div>
                <div className="text-lg">
                  {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
                </div>
                <p className="text-xs text-muted-foreground">
                  Hasta la fecha límite
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Withdraw Actions */}
      <Card className="border-2 border-accent/20 bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="mr-2 h-5 w-5" />
            Gestión de Retiros
          </CardTitle>
          <CardDescription>
            Administra tus {groupData.type === 'savings' ? 'ahorros' : 'inversiones'} y retira fondos cuando sea necesario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Retiro de Ahorro/Inversión */}
            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold">
                    {groupData.type === 'savings' ? 'Retiro de Ahorros' : 'Retiro de Inversión'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Tu contribución: ${groupData.userContribution.toLocaleString()}
                  </p>
                </div>
                {groupData.type === 'investment' && !canWithdrawInvestment() && (
                  <Lock className="h-4 w-4 text-yellow-600" />
                )}
              </div>
              
              {groupData.type === 'investment' && !canWithdrawInvestment() && groupData.investmentTerm && (
                <Alert className="mb-3 border-yellow-200 bg-yellow-50">
                  <Clock className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Tu inversión estará disponible para retiro después del <strong>{new Date(groupData.investmentTerm).toLocaleDateString()}</strong>
                  </AlertDescription>
                </Alert>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled={groupData.type === 'investment' && !canWithdrawInvestment()}
                    onClick={() => handleWithdraw('savings')}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {groupData.type === 'investment' && !canWithdrawInvestment() ? 'Bloqueado hasta fecha límite' : 
                     groupData.type === 'savings' ? 'Retirar Ahorros' : 'Retirar Inversión'}
                  </Button>
                </AlertDialogTrigger>
              </AlertDialog>
            </div>

            {/* Retiro de Ganancias (solo para inversiones) */}
            {groupData.type === 'investment' && (
              <div className="p-4 border rounded-lg bg-card">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">Retiro de Ganancias</h4>
                    <p className="text-sm text-muted-foreground">
                      Tus ganancias: ${groupData.userProfits.toLocaleString()}
                    </p>
                  </div>
                  <Unlock className="h-4 w-4 text-green-600" />
                </div>
                
                <Alert className="mb-3 border-green-200 bg-green-50">
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Las ganancias están disponibles para retiro en cualquier momento
                  </AlertDescription>
                </Alert>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleWithdraw('profits')}
                      disabled={groupData.userProfits <= 0}
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      {groupData.userProfits > 0 ? 'Retirar Ganancias' : 'Sin ganancias disponibles'}
                    </Button>
                  </AlertDialogTrigger>
                </AlertDialog>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Withdraw Confirmation Dialog */}
      <AlertDialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirmar {withdrawType === 'savings' ? 
                (groupData.type === 'savings' ? 'Retiro de Ahorros' : 'Retiro de Inversión') : 
                'Retiro de Ganancias'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {withdrawType === 'savings' ? (
                <>
                  ¿Estás seguro de que quieres retirar tu {groupData.type === 'savings' ? 'ahorro' : 'inversión'} 
                  de <strong>${groupData.userContribution.toLocaleString()}</strong>?
                  <br /><br />
                  <strong>Importante:</strong> {groupData.type === 'savings' ? 
                    'Al retirar tus ahorros, saldrás del grupo y no podrás volver a unirte.' :
                    'Al retirar tu inversión, saldrás del grupo de inversión y perderás cualquier beneficio futuro.'}
                </>
              ) : (
                <>
                  ¿Estás seguro de que quieres retirar tus ganancias de <strong>${groupData.userProfits.toLocaleString()}</strong>?
                  <br /><br />
                  <strong>Nota:</strong> Esto no afectará tu participación en el grupo, solo retirará las ganancias generadas hasta ahora.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmWithdraw} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Confirmar Retiro
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="members">Miembros</TabsTrigger>
          <TabsTrigger value="transactions">Transacciones</TabsTrigger>
          <TabsTrigger value="voting">Votaciones</TabsTrigger>
          <TabsTrigger value="ai">Asistente IA</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento del Grupo</CardTitle>
                <CardDescription>
                  Progreso vs meta mensual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={groupData.performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" name="Actual" />
                    <Bar dataKey="target" fill="hsl(var(--muted))" name="Meta" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contribuciones por Miembro</CardTitle>
                <CardDescription>
                  Estado de aportes individuales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groupData.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ${member.contribution.toLocaleString()} contribuido
                          </p>
                        </div>
                      </div>
                      <Badge variant={member.status === 'late' ? 'destructive' : 'default'}>
                        {member.status === 'late' ? (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Atrasado
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Al día
                          </>
                        )}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Miembros</CardTitle>
              <CardDescription>
                Administra los miembros del grupo y sus contribuciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupData.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Contribución total: ${member.contribution.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Porcentaje: {Math.round((member.contribution / groupData.current) * 100)}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={member.status === 'late' ? 'destructive' : 'default'}>
                        {member.status === 'late' ? 'Atrasado' : 'Al día'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Contactar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Transacciones</CardTitle>
              <CardDescription>
                Todas las transacciones del grupo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupData.transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">
                        {transaction.type === 'contribution' ? 'Contribución' : 'Inversión'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {transaction.member || transaction.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${transaction.amount.toLocaleString()}</p>
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                        {transaction.status === 'completed' ? 'Completado' : 'Pendiente'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voting" className="space-y-6">
          {groupData.activeVoting && (
            <Card>
              <CardHeader>
                <CardTitle>Votación Activa</CardTitle>
                <CardDescription>
                  Decide sobre la siguiente propuesta de inversión
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{groupData.activeVoting.title}</h3>
                    <p className="text-muted-foreground">{groupData.activeVoting.description}</p>
                    <p className="text-sm mt-2">
                      <strong>Monto:</strong> ${groupData.activeVoting.amount.toLocaleString()}
                    </p>
                    <p className="text-sm">
                      <strong>Detalles:</strong> {groupData.activeVoting.details}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Resultados actuales:</p>
                      <p className="text-sm text-muted-foreground">
                        {groupData.activeVoting.votesFor} a favor, {groupData.activeVoting.votesAgainst} en contra
                      </p>
                      <Progress 
                        value={(groupData.activeVoting.votesFor / groupData.activeVoting.totalMembers) * 100} 
                        className="mt-2"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => handleVote('against')} variant="outline">
                        Votar en Contra
                      </Button>
                      <Button onClick={() => handleVote('for')}>
                        Votar a Favor
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="w-5 h-5 mr-2 text-primary" />
                Asistente IA "Gro"
              </CardTitle>
              <CardDescription>
                Pregúntale a Gro sobre el progreso del grupo y sus miembros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Chat input */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ej: ¿Cómo va el grupo? ¿Quién está atrasado en pagos?"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && askAI()}
                    disabled={aiLoading}
                  />
                  <Button onClick={askAI} disabled={aiLoading || !aiQuestion.trim()}>
                    {aiLoading ? 'Pensando...' : 'Preguntar'}
                  </Button>
                </div>

                {/* AI Response */}
                {aiAnswer && (
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Bot className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-primary mb-3">Gro responde:</p>
                        <MarkdownFormatter text={aiAnswer} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <button 
                    onClick={() => { setAiQuestion('¿Cómo va el progreso del grupo?'); }}
                    className="p-3 text-left text-sm border rounded-lg hover:bg-accent transition-colors"
                  >
                    <p className="font-medium">💰 Progreso del Grupo</p>
                    <p className="text-xs text-muted-foreground">Ver cómo va el avance general</p>
                  </button>
                  <button 
                    onClick={() => { setAiQuestion('¿Quién está atrasado en los pagos?'); }}
                    className="p-3 text-left text-sm border rounded-lg hover:bg-accent transition-colors"
                  >
                    <p className="font-medium">⏰ Estado de Miembros</p>
                    <p className="text-xs text-muted-foreground">Ver quién necesita pagar</p>
                  </button>
                  <button 
                    onClick={() => { setAiQuestion('¿Cuánto ha aportado cada miembro?'); }}
                    className="p-3 text-left text-sm border rounded-lg hover:bg-accent transition-colors"
                  >
                    <p className="font-medium">📊 Aportes por Miembro</p>
                    <p className="text-xs text-muted-foreground">Ver contribuciones individuales</p>
                  </button>
                  <button 
                    onClick={() => { setAiQuestion('¿Cuándo alcanzaremos la meta?'); }}
                    className="p-3 text-left text-sm border rounded-lg hover:bg-accent transition-colors"
                  >
                    <p className="font-medium">🎯 Proyección</p>
                    <p className="text-xs text-muted-foreground">Estimar cuándo llegar a la meta</p>
                  </button>
                </div>

                {/* Informative cards */}
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">Estado de Pagos</p>
                      <p className="text-sm text-red-700">
                        {groupData.members.filter(m => m.status === 'late').length > 0 ? (
                          `${groupData.members.filter(m => m.status === 'late').length} miembro(s) tiene(n) retraso en sus pagos.`
                        ) : (
                          '✅ Todos los miembros están al día con sus pagos. ¡Excelente trabajo en equipo!'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
