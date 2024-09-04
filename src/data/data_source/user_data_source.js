import { UserEntity } from 'data/entity/user_entity';
import { supabase } from '../../index';

export var CURRENT_USER;

export function setCurrentUser(user) {
  CURRENT_USER = user;
}

export async function getUserById(uuid) {
  var data;
  if (sessionStorage.getItem(uuid) != null) {
    data = JSON.parse(sessionStorage.getItem(uuid));
  } else {
    data = await supabase.from('users').select('*').eq('id', uuid);
    data = data.data[0];
    sessionStorage.setItem(uuid, JSON.stringify(data));
  }
  return new UserEntity({
    id: data.id,
    name: data.name,
    role: data.role,
    es: data.es,
    username: data.username,
    password: data.password,
    lastLogin: data.lastLogin,
    isAdmin: data.isAdmin,
  });
}
