
exports.up = function(knex, Promise) {
  return knex.raw(`
    CREATE TABLE fact (
      id          UUID,
      attribute   TEXT NOT NULL,
      value       JSONB NOT NULL,
      transaction BIGINT NOT NULL,
      assertion   BOOLEAN DEFAULT TRUE
    );
    
    
    
    `)
};

exports.down = function(knex, Promise) {
  
};
