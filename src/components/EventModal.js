import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// [BACKEND] Modal de criação/edição de evento — integração futura via onSave e onDelete
function EventModal({ open, evento, onChange, onClose, onSave, onDelete, editando }) {
  const handleInput = (field) => (e) => {
    onChange({ ...evento, [field]: e.target.value });
  };

  const handleDate = (field) => (newValue) => {
    onChange({ ...evento, [field]: newValue });
  };

  const handleTipo = (_, novoTipo) => {
    if (novoTipo !== null) {
      onChange({ ...evento, tipo: novoTipo });
    }
  };

  const handleCheckbox = (e) => {
    onChange({ ...evento, concluido: e.target.checked });
  };

  const emoji =
    evento.tipo === 'lembrete'
      ? '🔔'
      : evento.tipo === 'tarefa'
      ? '✅'
      : '🎯';

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="pt-br">
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editando ? 'Editar Evento' : 'Criar Evento'} {emoji}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, mb: 2 }}>
            <ToggleButtonGroup
              value={evento.tipo || 'evento'}
              exclusive
              onChange={handleTipo}
              fullWidth
              color="primary"
            >
              <ToggleButton value="evento">Evento 🎯</ToggleButton>
              <ToggleButton value="lembrete">Lembrete 🔔</ToggleButton>
              <ToggleButton value="tarefa">Tarefa ✅</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <TextField
            fullWidth
            label="Título"
            margin="dense"
            value={evento.title}
            onChange={handleInput('title')}
          />

          <DateTimePicker
            label="Início"
            value={evento.start}
            onChange={handleDate('start')}
            renderInput={(params) => <TextField fullWidth margin="dense" {...params} />}
          />

          {evento.tipo !== 'lembrete' && (
            <DateTimePicker
              label="Fim"
              value={evento.end}
              onChange={handleDate('end')}
              renderInput={(params) => <TextField fullWidth margin="dense" {...params} />}
            />
          )}

          <TextField
            fullWidth
            label="Local"
            margin="dense"
            value={evento.local || ''}
            onChange={handleInput('local')}
          />

          <TextField
            fullWidth
            label="Participantes (e-mails separados por vírgula)"
            margin="dense"
            value={evento.participantes || ''}
            onChange={handleInput('participantes')}
          />

          {evento.tipo === 'tarefa' && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={evento.concluido || false}
                  onChange={handleCheckbox}
                  color="success"
                />
              }
              label="Concluído"
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>

        <DialogActions>
          {onDelete && (
            <Button onClick={onDelete} color="error">
              Excluir
            </Button>
          )}
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={onSave} variant="contained" color="success">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}

export default EventModal;
