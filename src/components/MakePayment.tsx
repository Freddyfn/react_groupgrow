import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  Shield,
  CheckCircle,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface GroupData {
  name: string;
  monthlyContribution: number;
  type: string;
}

export function MakePayment() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (groupId) {
      fetchGroupData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const fetchGroupData = async () => {
    try {
      setLoading(true);
      // Buscar token en ambos almacenamientos (Remember Me usa localStorage, sin Remember Me usa sessionStorage)
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      if (!token) {
        toast.error('Debes iniciar sesión para hacer pagos');
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
      const data = await response.json();
      setGroupData({
        name: data.name,
        monthlyContribution: data.monthlyContribution || 500,
        type: data.type
      });
    } catch (error) {
      console.error('Error fetching group data:', error);
      toast.error('Error al cargar los datos del grupo');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\//g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardNumber(formatCardNumber(value));
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\//g, '');
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setExpiryDate(formatExpiryDate(value));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setCvv(value);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }

    if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
      alert('Por favor ingresa un número de tarjeta válido');
      return;
    }

    if (!cardName) {
      alert('Por favor ingresa el nombre del titular');
      return;
    }

    if (!expiryDate || expiryDate.length !== 5) {
      alert('Por favor ingresa una fecha de vencimiento válida (MM/YY)');
      return;
    }

    if (!cvv || cvv.length !== 3) {
      alert('Por favor ingresa un CVV válido');
      return;
    }

    setIsProcessing(true);

    try {
      // Buscar token en ambos almacenamientos (Remember Me usa localStorage, sin Remember Me usa sessionStorage)
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      if (!token) {
        toast.error('Debes iniciar sesión para hacer pagos');
        navigate('/login');
        return;
      }

      // Procesar pago con el backend
      const response = await fetch('/api/v1/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          groupId: parseInt(groupId!),
          amount: parseFloat(amount),
          cardNumber: cardNumber.replace(/\s/g, ''),
          cardName: cardName,
          description: `Contribución al grupo ${groupData?.name || ''}`
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al procesar el pago');
      }

      const result = await response.json();

      if (result.status === 'completed') {
        setIsProcessing(false);
        setPaymentSuccess(true);

        // Redirect after success
        setTimeout(() => {
          navigate(`/group/${groupId}`);
        }, 3000);
      } else {
        throw new Error(result.message || 'Error al procesar el pago');
      }
    } catch (error: any) {
      setIsProcessing(false);
      alert('Error al procesar el pago: ' + (error.message || 'Error desconocido'));
    }
  };

  const setSuggestedAmount = (suggestedAmount: number) => {
    setAmount(suggestedAmount.toString());
  };

  if (loading || !groupData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-lg text-muted-foreground">Cargando datos del grupo...</p>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl mb-2">¡Pago Exitoso!</h2>
                <p className="text-muted-foreground">
                  Tu aporte de <strong>${parseFloat(amount).toLocaleString()}</strong> ha sido procesado correctamente.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Serás redirigido al dashboard del grupo...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate(`/group/${groupId}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl">Realizar Pago</h1>
          <p className="text-muted-foreground">{groupData.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Monto a Aportar
              </CardTitle>
              <CardDescription>
                Define el monto que deseas contribuir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="amount">Monto (USD)</Label>
                <Input
                  id="amount"
                  type="text"
                  placeholder="0.00"
                  value={amount}
                  onChange={handleAmountChange}
                  className="text-xl mt-2"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSuggestedAmount(groupData.monthlyContribution)}
                >
                  Aporte sugerido: ${groupData.monthlyContribution}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSuggestedAmount(groupData.monthlyContribution / 2)}
                >
                  ${groupData.monthlyContribution / 2}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSuggestedAmount(groupData.monthlyContribution * 2)}
                >
                  ${groupData.monthlyContribution * 2}
                </Button>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  El aporte mínimo sugerido es de <strong>${groupData.monthlyContribution}</strong> mensuales.
                  Puedes aportar cualquier monto.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Información de Tarjeta
              </CardTitle>
              <CardDescription>
                Ingresa los datos de tu tarjeta de crédito o débito
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="cardName">Nombre del Titular</Label>
                  <Input
                    id="cardName"
                    type="text"
                    placeholder="JUAN PÉREZ"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Fecha de Vencimiento</Label>
                    <Input
                      id="expiryDate"
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={handleExpiryDateChange}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={handleCvvChange}
                      className="mt-2"
                    />
                  </div>
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Pago seguro:</strong> Esta es una simulación de pago para pruebas.
                    Usa cualquier número de 16 dígitos.
                  </AlertDescription>
                </Alert>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>Procesando Pago...</>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Procesar Pago de ${amount || '0.00'}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Card Preview */}
        <div className="space-y-6">
          <div
            className="rounded-lg shadow-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #0f172a 100%)'
            }}
          >
            <div className="p-8">
              <div className="space-y-8">
                {/* Card Header */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="inline-block px-2 py-1 text-xs rounded bg-white/20 text-white">
                      Tarjeta de Prueba
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-8 h-8 rounded-full bg-white/30" />
                    <div className="w-8 h-8 rounded-full bg-white/50" />
                  </div>
                </div>

                {/* Card Chip */}
                <div className="flex items-center space-x-4">
                  <div
                    className="w-12 h-10 rounded"
                    style={{
                      background: 'linear-gradient(135deg, #facc15 0%, #ca8a04 100%)'
                    }}
                  />
                  <div className="space-x-1 flex">
                    <div className="w-2 h-6 bg-white/30 rounded" />
                    <div className="w-2 h-6 bg-white/30 rounded" />
                    <div className="w-2 h-6 bg-white/30 rounded" />
                  </div>
                </div>

                {/* Card Number */}
                <div>
                  <p className="text-2xl tracking-wider font-mono text-white">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </p>
                </div>

                {/* Card Details */}
                <div className="flex justify-between items-end text-white">
                  <div>
                    <p className="text-xs text-white/60 mb-1">Titular</p>
                    <p className="tracking-wide">
                      {cardName || 'NOMBRE APELLIDO'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 mb-1">Vencimiento</p>
                    <p className="tracking-wider font-mono">
                      {expiryDate || 'MM/YY'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 mb-1">CVV</p>
                    <p className="tracking-wider font-mono">
                      {cvv ? cvv.replace(/./g, '•') : '•••'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Grupo:</span>
                <span className="font-medium">{groupData.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tipo:</span>
                <Badge variant="default">
                  {groupData.type === 'investment' ? 'Inversión' : 'Ahorro'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Aporte sugerido:</span>
                <span>${groupData.monthlyContribution.toLocaleString()}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Monto a pagar:</span>
                  <span className="text-2xl">
                    ${amount ? parseFloat(amount).toLocaleString() : '0.00'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Nota:</strong> Esta es una simulación para pruebas.
              En producción se integraría con PayPal o Stripe para procesar pagos reales.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
