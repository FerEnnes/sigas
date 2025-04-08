// [BACKEND] Aqui futuramente vamos buscar e persistir os eventos usando Django + Postgres

import React, { useState } from 'react';
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

function CalendarioPage() {
  const [eventos, setEventos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [visualizacao, setVisualizacao] = useState('month');
  const [dataAtual, setDataAtual] = useState(new Date());

  const [novoEvento, setNovoEvento] = useState({
    title: '',
    start: moment(),
    end: moment().add(1, 'hour'),
    tipo: 'evento',
    local: '',
    participantes: '',
    concluido: false,
  });

  const abrirModal = ({ start, end }) => {
    setNovoEvento({
      title: '',
      start: moment(start),
      end: moment(end),
      tipo: 'evento',
      local: '',
      participantes: '',
      concluido: false,
    });
    setEditando(false);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setEventoSelecionado(null);
  };

  const salvarEvento = () => {
    if (!novoEvento.title.trim()) {
      alert('Digite um título');
      return;
    }

    const novo = {
      ...novoEvento,
      start: novoEvento.start.toDate(),
      end:
        novoEvento.tipo === 'lembrete'
          ? novoEvento.start.toDate()
          : novoEvento.end.toDate(),
    };

    if (editando) {
      // [BACKEND] PUT: Atualizar evento existente no backend
      const atualizados = eventos.map((ev) =>
        ev === eventoSelecionado ? novo : ev
      );
      setEventos(atualizados);
    } else {
      // [BACKEND] POST: Criar novo evento no backend
      setEventos([...eventos, novo]);
    }

    fecharModal();
  };

  const excluirEvento = () => {
    // [BACKEND] DELETE: Remover evento do backend
    setEventos(eventos.filter((ev) => ev !== eventoSelecionado));
    fecharModal();
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
        <title>Calendário | SaaS Agro</title>
        <meta name="description" content="Visualize e gerencie eventos, tarefas e lembretes no seu calendário agrícola." />
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
                onClick={() => abrirModal({
                  start: moment(),
                  end: moment().add(1, 'hour'),
                })}
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
                  style={{ width: 150 }}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="evento">Evento</MenuItem>
                  <MenuItem value="lembrete">Lembrete</MenuItem>
                  <MenuItem value="tarefa">Tarefa</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filtroStatus}
                  label="Status"
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  style={{ width: 150 }}
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
                return { style: { backgroundColor, color: '#fff' } };
              }}
              components={{
                event: ({ event }) => (
                  <span>
                    {emojiTipo[event.tipo] || ''} [{event.tipo?.toUpperCase()}] {event.title}
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
