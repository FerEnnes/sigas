import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import {
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Card,
  CardContent,
  Typography,
  Container
} from '@mui/material';

import Sidebar from '../components/Sidebar';
import EventModal from '../components/EventModal';

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const messages = {
  today: 'Hoje',
  previous: 'Anterior',
  next: 'Próximo',
  month: 'Mês',
  week: 'Semana',
  day: 'Dia',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'Sem eventos neste período',
};

const backendToFront = (ev) => ({
  id: ev.id,
  title: ev.titulo,
  start: new Date(ev.inicio),
  end: new Date(ev.fim),
  tipo: ev.tipo || 'evento',
  local: ev.local || '',
  participantes: ev.participantes || '',
  concluido: !!ev.concluido,
  conta_pagar: ev.conta_pagar,
  conta_receber: ev.conta_receber,
});

const frontToBackend = (ev) => ({
  titulo: ev.title,
  inicio: ev.start.toISOString(),
  fim:
    ev.tipo === 'lembrete'
      ? ev.start.toISOString()
      : ev.end.toISOString(),
  tipo: ev.tipo,
  local: ev.local,
  participantes: ev.participantes,
  concluido: ev.concluido,
  conta_pagar: ev.conta_pagar || null,
  conta_receber: ev.conta_receber || null,
});

function CalendarioPage() {
  const [eventos, setEventos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [visualizacao, setVisualizacao] = useState('month');
  const [dataAtual, setDataAtual] = useState(new Date());

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const [novoEvento, setNovoEvento] = useState({
    id: null,
    title: '',
    start: moment(),
    end: moment().add(1, 'hour'),
    tipo: 'evento',
    local: '',
    participantes: '',
    concluido: false,
  });

  useEffect(() => {
    async function carregarEventos() {
      if (!token) return;
      try {
        const res = await fetch('http://127.0.0.1:8000/api/agenda-eventos/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!res.ok) {
          console.error('Erro ao carregar eventos:', res.status);
          return;
        }

        const data = await res.json();
        const formatados = data.map(backendToFront);
        setEventos(formatados);
      } catch (err) {
        console.error('Erro ao buscar eventos:', err);
      }
    }

    carregarEventos();
  }, [token]);

  const abrirModal = ({ start, end }) => {
    setNovoEvento({
      id: null,
      title: '',
      start: moment(start),
      end: moment(end),
      tipo: 'evento',
      local: '',
      participantes: '',
      concluido: false,
    });
    setEditando(false);
    setEventoSelecionado(null);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setEventoSelecionado(null);
  };

  const salvarEvento = async () => {
    if (!novoEvento.title.trim()) {
      alert('Digite um título');
      return;
    }

    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }

    const payload = frontToBackend({
      ...novoEvento,
      start: novoEvento.start,
      end: novoEvento.end,
    });

    try {
      if (editando && novoEvento.id) {
        const res = await fetch(
          `http://127.0.0.1:8000/api/agenda-eventos/${novoEvento.id}/`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) {
          alert('Erro ao atualizar evento.');
          return;
        }

        const data = await res.json();
        const evAtualizado = backendToFront(data);

        setEventos((prev) =>
          prev.map((ev) => (ev.id === evAtualizado.id ? evAtualizado : ev))
        );
      } else {
        const res = await fetch('http://127.0.0.1:8000/api/agenda-eventos/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          alert('Erro ao criar evento.');
          return;
        }

        const data = await res.json();
        const evNovo = backendToFront(data);
        setEventos((prev) => [...prev, evNovo]);
      }

      fecharModal();
    } catch (err) {
      console.error('Erro ao salvar evento:', err);
      alert('Erro ao salvar evento.');
    }
  };

  const excluirEvento = async () => {
    if (!eventoSelecionado || !eventoSelecionado.id) {
      fecharModal();
      return;
    }

    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }

    if (!window.confirm('Deseja realmente excluir este evento?')) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/agenda-eventos/${eventoSelecionado.id}/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (res.status !== 204 && res.status !== 200) {
        alert('Erro ao excluir evento.');
        return;
      }

      setEventos((prev) =>
        prev.filter((ev) => ev.id !== eventoSelecionado.id)
      );
      fecharModal();
    } catch (err) {
      console.error('Erro ao excluir evento:', err);
      alert('Erro ao excluir evento.');
    }
  };

  const editarEvento = (evento) => {
    setEventoSelecionado(evento);
    setNovoEvento({
      ...evento,
      start: moment(evento.start),
      end: moment(evento.end),
    });
    setEditando(true);
    setModalAberto(true);
  };

  const corTarefa = (evento) => {
    if (evento.concluido) return '#4caf50';
    if (moment(evento.end).isBefore(moment())) return '#f44336';
    return '#ff9800';
  };

  const emojiTipo = {
    evento: '🗓️',
    lembrete: '🔔',
    tarefa: '✅',
    conta_pagar: '💸',
    conta_receber: '💰',
  };

  const filtrarEventos = () =>
    eventos.filter((ev) => {
      const tipoOK = filtroTipo === 'todos' || ev.tipo === filtroTipo;
      const statusOK =
        filtroStatus === 'todos' ||
        (filtroStatus === 'concluido' && ev.concluido) ||
        (filtroStatus === 'pendente' &&
          !ev.concluido &&
          moment(ev.end).isSameOrAfter(moment())) ||
        (filtroStatus === 'atrasado' &&
          !ev.concluido &&
          moment(ev.end).isBefore(moment()));
      return tipoOK && statusOK;
    });

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Helmet>
        <title>Calendário | SIGAS</title>
        <meta
          name="description"
          content="Visualize e gerencie eventos, tarefas, lembretes e contas no seu calendário."
        />
      </Helmet>

      <Sidebar />

      <Container maxWidth="xl" style={{ padding: '32px 24px' }}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" fontWeight={600}>
                Calendário
              </Typography>
              <Button
                variant="contained"
                style={{ backgroundColor: '#6da972' }}
                onClick={() =>
                  abrirModal({
                    start: moment(),
                    end: moment().add(1, 'hour'),
                  })
                }
              >
                + Criar Evento
              </Button>
            </Box>

            <Box display="flex" gap={2} mb={3}>
              <FormControl size="small">
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={filtroTipo}
                  label="Tipo"
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  style={{ width: 170 }}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="evento">Evento</MenuItem>
                  <MenuItem value="lembrete">Lembrete</MenuItem>
                  <MenuItem value="tarefa">Tarefa</MenuItem>
                  <MenuItem value="conta_pagar">Conta a pagar</MenuItem>
                  <MenuItem value="conta_receber">Conta a receber</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filtroStatus}
                  label="Status"
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  style={{ width: 170 }}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="concluido">Concluído</MenuItem>
                  <MenuItem value="pendente">Pendente</MenuItem>
                  <MenuItem value="atrasado">Atrasado</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Calendar
              localizer={localizer}
              events={filtrarEventos()}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              selectable
              popup
              views={['month', 'week', 'day', 'agenda']}
              view={visualizacao}
              onView={setVisualizacao}
              date={dataAtual}
              onNavigate={setDataAtual}
              onSelectSlot={abrirModal}
              onSelectEvent={editarEvento}
              messages={messages}
              eventPropGetter={(event) => {
                let backgroundColor = '#4caf50';
                if (event.tipo === 'lembrete') backgroundColor = '#2196f3';
                else if (event.tipo === 'tarefa') backgroundColor = corTarefa(event);
                else if (event.tipo === 'conta_pagar') backgroundColor = '#f57c00';
                else if (event.tipo === 'conta_receber') backgroundColor = '#388e3c';

                return { style: { backgroundColor, color: '#fff' } };
              }}
              components={{
                event: ({ event }) => (
                  <span>
                    {emojiTipo[event.tipo] || ''} {event.title}
                  </span>
                ),
              }}
            />
          </CardContent>
        </Card>

        <EventModal
          open={modalAberto}
          evento={novoEvento}
          onChange={setNovoEvento}
          onClose={fecharModal}
          onSave={salvarEvento}
          onDelete={editando ? excluirEvento : null}
          editando={editando}
        />
      </Container>
    </div>
  );
}

export default CalendarioPage;
