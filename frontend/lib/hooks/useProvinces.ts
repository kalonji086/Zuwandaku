import { useQuery } from '@tanstack/react-query';

export interface Province {
  id: string;
  nom: string;
  code: string;
}

const PROVINCES_MOCK: Province[] = [
  { id: '1', nom: 'Kinshasa', code: 'KN' },
  { id: '2', nom: 'Lualaba', code: 'LL' },
  { id: '3', nom: 'Haut-Katanga', code: 'HK' },
  { id: '4', nom: 'Kongo Central', code: 'KC' },
  { id: '5', nom: 'Kwango', code: 'KW' },
  { id: '6', nom: 'Kwilu', code: 'KL' },
  { id: '7', nom: 'Lomami', code: 'LM' },
  { id: '8', nom: 'Lualaba', code: 'LB' },
  { id: '9', nom: 'Mai-Ndombe', code: 'MN' },
  { id: '10', nom: 'Maniema', code: 'MA' },
  { id: '11', nom: 'Mongala', code: 'MO' },
  { id: '12', nom: 'Nord-Kivu', code: 'NK' },
  { id: '13', nom: 'Nord-Ubangi', code: 'NU' },
  { id: '14', nom: 'Sankuru', code: 'SA' },
  { id: '15', nom: 'Sud-Kivu', code: 'SK' },
  { id: '16', nom: 'Sud-Ubangi', code: 'SU' },
  { id: '17', nom: 'Tanganyika', code: 'TA' },
  { id: '18', nom: 'Tshopo', code: 'TS' },
  { id: '19', nom: 'Tshuapa', code: 'TH' },
  { id: '20', nom: 'Ituri', code: 'IT' },
  { id: '21', nom: 'Kasaï', code: 'KS' },
  { id: '22', nom: 'Kasaï Central', code: 'KC' },
  { id: '23', nom: 'Kasaï Oriental', code: 'KO' },
  { id: '24', nom: 'Kondoland', code: 'KL' },
  { id: '25', nom: 'Kwango', code: 'KW' },
  { id: '26', nom: 'Lomami', code: 'LM' },
];

export function useProvinces() {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: () => Promise.resolve(PROVINCES_MOCK),
  });
}

// export default useProvinces;


