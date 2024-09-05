import { UserEntity } from 'data/entity/user_entity';
import { supabase } from '../../index';

export var CURRENT_USER;

export function setCurrentUser(user) {
  CURRENT_USER = user;
}

export async function getAllUsers() {
  var result = [];
  var data = await supabase.from('users').select('*');
  for (var i = 0; i < data.data.length; i++) {
    var user = data.data[i];
    result.push(
      new UserEntity({
        id: user.id,
        name: user.name,
        role: user.role,
        es: user.es,
        username: user.username,
        password: user.password,
        lastLogin: user.lastLogin,
        isAdmin: user.isAdmin,
      })
    );
  }
  return result;
}

export async function getUserBySSO(name, pass) {
  var data = await supabase
    .from('users')
    .select('*')
    .eq('username', name)
    .eq('password', pass);
  data = data.data[0];

  if (data == null || data == undefined) {
    return null;
  } else {
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
