/**
 * Define user schema
 */
var User = define('User', {
  email: { type: String },
  password_salt: { type: String },
  password: { type: String }    
});

/**
 * Define person schema 
 */
var Project = define('Project', {
  name: { type: String },
  owner_id: { type: String },
  description: { type: String },
  status: { type: String }    
});

var Collaborator = define('Collaborator', {
  user_id: { type: String },
  access: { type: String }
});