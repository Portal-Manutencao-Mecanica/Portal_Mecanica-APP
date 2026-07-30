<<<<<<< HEAD
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import Button from '@/components/atoms/Button';
import { MachineTable } from '@/components/organisms/MachineTable';
import LayoutDesktop from '@/components/templates/LayoutDesktop';
import type { Machine } from '@/lib/api/types';
import { getServiceErrorMessage } from '@/services/httpService';
import { machineService } from '@/services/machineService';

export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    machineService.list()
      .then(setMachines)
      .catch((requestError: unknown) => {
        setError(getServiceErrorMessage(
          requestError,
          'Falha ao carregar m\u00e1quinas.',
        ));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const tableMachines = machines.map((machine) => ({
    ...machine,
    place: machine.placeName,
  }));

=======
import Link from "next/link";

import Button from "@/components/atoms/Button";
import { MachineTable } from "@/components/organisms/MachineTable";
import LayoutDesktop from "@/components/templates/LayoutDesktop";

const machines = [
  {
    id: 1,
    patrimony: "100001",
    name: "Torno CNC",
    place: "Laboratório A",
    condition: "ATIVA",
    tag: "CNC",
  },
  {
    id: 2,
    patrimony: "100002",
    name: "Impressora 3D",
    place: "Laboratório B",
    condition: "MANUTENCAO",
    tag: "3D",
  },
  {
    id: 3,
    patrimony: "100003",
    name: "Fresadora",
    place: "Laboratório C",
    condition: "ATIVA",
    tag: "FRESA",
  },
] as const;

export default function MachinesPage() {
>>>>>>> origin/develop
  return (
    <LayoutDesktop>
      <div className='max-w-7xl mx-auto p-4 md:p-8 space-y-6'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold'>M&aacute;quinas</h1>
            <p className='text-gray-500'>
              Visualize todas as m&aacute;quinas cadastradas.
            </p>
          </div>

          <Link href='/maquinas/criar'>
            <Button>Nova M&aacute;quina</Button>
          </Link>
        </div>

<<<<<<< HEAD
        {isLoading && (
          <p className='rounded-lg border border-gray-200 bg-white p-6 text-gray-500'>
            Carregando m&aacute;quinas...
          </p>
        )}
=======
        <MachineTable machines={machines as any} />
>>>>>>> origin/develop

        {error && (
          <p role='alert' className='rounded-lg bg-red-50 p-4 text-red-700'>
            {error}
          </p>
        )}

        {!isLoading && !error && tableMachines.length === 0 && (
          <p className='rounded-lg border border-gray-200 bg-white p-6 text-gray-600'>
            Nenhuma m&aacute;quina cadastrada.
          </p>
        )}

        {!isLoading && !error && tableMachines.length > 0 && (
          <MachineTable machines={tableMachines} />
        )}
      </div>
    </LayoutDesktop>
  );
}