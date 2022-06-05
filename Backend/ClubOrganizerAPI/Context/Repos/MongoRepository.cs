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
        protected ILogger log = Utilities.Logger.ContextLog<MongoDocument>();

        private readonly IMongoCollection<TEntity> _collection;

        public MongoRepository(MongoDBContext Context)
        {
            _collection = Context.DataBase.GetCollection<TEntity>(typeof(TEntity).Name.ToString());
        }

        public IMongoCollection<TEntity> Collection
        {
            get
            {
                return _collection;
            }
        }



        public virtual IQueryable<TEntity> AsQueryable()
        {
            return _collection.AsQueryable();
        }

        public virtual IEnumerable<TEntity> FilterBy(
            Expression<Func<TEntity, bool>> filterExpression)
        {
            return _collection.Find(filterExpression).ToEnumerable();
        }

        public virtual IEnumerable<TProjected> FilterBy<TProjected>(
            Expression<Func<TEntity, bool>> filterExpression,
            Expression<Func<TEntity, TProjected>> projectionExpression)
        {
            return _collection.Find(filterExpression).Project(projectionExpression).ToEnumerable();
        }

        public virtual TEntity FindOne(Expression<Func<TEntity, bool>> filterExpression)
        {
            return _collection.Find(filterExpression).FirstOrDefault();
        }

        public async virtual Task<TEntity> FindOneAsync(Expression<Func<TEntity, bool>> filterExpression)
        {
            return await _collection.Find(filterExpression).FirstOrDefaultAsync();
        }

        public virtual TEntity FindById(string id)
        {
            var objectId = ObjectId.Parse(id);
            var filter = Builders<TEntity>.Filter.Eq(doc => doc.ID, id);
            return _collection.Find(filter).SingleOrDefault();
        }

        public async virtual Task<TEntity> FindByIdAsync(string id)
        {

            var objectId = ObjectId.Parse(id);
            var filter = Builders<TEntity>.Filter.Eq(doc => doc.ID, id);
            return await _collection.Find(filter).SingleOrDefaultAsync();

        }

        public async virtual Task<TEntity> InsertOneAsync(TEntity document)
        {
            try
            {
                //await _collection.InsertOneAsync(document);

                await document.SaveAsync();
                return document;
            }
            catch (MongoWriteException ex)
            {
                log.Error("Error while saving", ex);
            }
            catch (Exception e)
            {
                log.Error("Error while saving", e);

            }
            return default;
        }


        public virtual async Task<TEntity> UpdateOneAsync(TEntity document)
        {
            var filter = Builders<TEntity>.Filter.Eq(doc => doc.ID, document.ID);
            await _collection.FindOneAndReplaceAsync(filter, document);

            return document;
        }

        public async Task DeleteOneAsync(Expression<Func<TEntity, bool>> filterExpression)
        {
            await _collection.FindOneAndDeleteAsync(filterExpression);
        }


        public async Task DeleteByIdAsync(string id)
        {

            var objectId = new ObjectId(id);
            var filter = Builders<TEntity>.Filter.Eq(doc => doc.ID, id);
            await _collection.FindOneAndDeleteAsync(filter);

        }



        public async Task DeleteManyAsync(Expression<Func<TEntity, bool>> filterExpression)
        {
            await _collection.DeleteManyAsync(filterExpression);
        }


        public async Task<TEntity> InsertOrUpdateOneAsync(TEntity document)
        {
            if (document != null && document.ID != null)
            {
                TEntity item = FindById(document.ID.ToString());

                if (item == null)
                {
                    await InsertOneAsync(document);
                }
                else
                {
                    await UpdateOneAsync(document);
                }
            }
            else
            {
                await InsertOneAsync(document);
            }

            return document;
        }
    }
}
