export function publicUser(user) {
  return {
    id: user.id,
    nome: user.name,
    email: user.email,
    matricula: user.membership_code,
    plano: user.plan_name,
    status: user.plan_status,
    vencimento: user.plan_expires_at,
    idade: user.age,
    peso: user.weight_kg,
    altura: user.height_m,
  };
}
