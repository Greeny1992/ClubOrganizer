using Context.Settings;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Entities;
using Serilog;
using System.Linq.Expressions;

namespace Context.Repos
{
    public class MongoRepository<TEntity> : IMongoRepository<TEntity> where TEntity : MongoDocument
    {
        public ILogger log = Utilities.Logger.ContextLog<MongoDocument>();
        private readonly IMongoCollection<TEntity> _collection;

        public MongoRepository(MongoDBContext Context)
        {
            _collection = Context.DataBase.GetCollection<TEntity>(typeof(TEntity).Name.ToString());
        }

        public Task DeleteByIdAsync(string id)
        {
            return Task.Run(() =>
            {
                var objectId = new ObjectId(id);
                var filter = Builders<TEntity>.Filter.Eq("_id", objectId);
                _collection.FindOneAndDeleteAsync(filter);
            });
        }

        public Task DeleteManyAsync(Expression<Func<TEntity, bool>> filterExpression)
        {
            return Task.Run(() => _collection.DeleteManyAsync(filterExpression));
        }

        public Task DeleteOneAsync(Expression<Func<TEntity, bool>> filterExpression)
        {
            return Task.Run(() => _collection.FindOneAndDeleteAsync(filterExpression));
        }

        public IEnumerable<TEntity> FilterBy(Expression<Func<TEntity, bool>> filterExpression)
        {
            return _collection.Find(filterExpression).ToEnumerable();
        }

        public async Task<TEntity> FindByIdAsync(String id)
        {
            var objectId = new ObjectId(id);
            FilterDefinition<TEntity> filterDefinition = Builders<TEntity>.Filter.Eq("_id", objectId);
            return await _collection.Find(filterDefinition).SingleOrDefaultAsync();
        }

        public Task<TEntity> FindOneAsync(Expression<Func<TEntity, bool>> filterExpression)
        {

            return Task.Run(() => _collection.Find(filterExpression).FirstOrDefaultAsync());
        }

        public virtual TEntity FindOne(Expression<Func<TEntity, bool>> filterExpression)
        {
            return _collection.Find(filterExpression).FirstOrDefault();
        }

        public virtual async Task<TEntity> InsertOrUpdateOneAsync(TEntity document)
        {
            try
            {
                await document.SaveAsync();
                return document;
            }
            catch (Exception ex)
            {
                log.Error("Geht ned");
            }

            return default;
        }
    }
}
