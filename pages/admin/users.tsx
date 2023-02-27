import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { IUser } from '@/interfaces';
import { tesloApi } from '@/api';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Grid, Select, MenuItem } from '@mui/material';
import { AdminLayout } from '@/components/layouts';

const UsersPage = () => {
    const { data, error } = useSWR<IUser[]>('/api/admin/users');
    const [ users, setUsers ] = useState<IUser[]>([]);

    useEffect(() => {
        if (data) {
            setUsers(data);
        }
      }, [data]);
    
      if ( !data && !error ) return (<></>);

         
      const onRoleUpdated = async( userId: string, newRole: string ) => {
        const previosUsers = users.map( user => ({ ...user }));
      
        const updatedUsers = users.map( user => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }));

        setUsers(updatedUsers);

        try {
            await tesloApi.put('/admin/users', {  userId, role: newRole });
        } catch (error) {
            setUsers(previosUsers);
            console.log(error);
            alert('No se pudo actualizar el role del usuario');
        }
    }


    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Correo', width: 250 },
        { field: 'name', headerName: 'Nombre completo', width: 300 },
        { field: 'role', headerName: 'Rol', width: 300,
            renderCell: ({row}) => {
                return (
                    <Select
                        value={ row.role }
                        label="Rol"
                        sx={{ width: '300px' }}
                        onChange={ ({ target }) => onRoleUpdated( row.id, target.value ) }
                    >
                        <MenuItem value='admin'> Admin </MenuItem>
                        <MenuItem value='client'> Client </MenuItem>
                    </Select>
                )
            }
        },
    ];

    const rows = users.map( user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }))

  return (
    <AdminLayout 
        title='Usuarios'
        subTitle='Gestión de usuarios'
        icon={<PeopleOutlineOutlinedIcon />}    
    >
        
        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height:650, width: '100%' }}>
                <DataGrid 
                    rows={ rows }
                    columns={ columns }
                    pageSize={ 10 }
                    rowsPerPageOptions={ [10] }
                />

            </Grid>
        </Grid>
    </AdminLayout>
  )
}

export default UsersPage