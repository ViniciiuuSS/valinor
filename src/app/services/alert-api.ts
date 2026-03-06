import { AlertService } from './alert.service';

export function alert() {
  const svc = AlertService.instancia;
  if (!svc) {
    return {
      add: (_msg: string) => undefined,
      remove: (_id?: string) => {},
      clear: () => {},
    };
  }

  return {
    add: (
      mensagem: string,
      tipo: 'success' | 'danger' | 'info' | 'warning' = 'success',
      duracao?: number,
    ) => svc.add(mensagem, tipo, duracao),
    remove: (id?: string) => {
      if (id) svc.remove(id);
    },
    clear: () => svc.clear(),
  };
}
