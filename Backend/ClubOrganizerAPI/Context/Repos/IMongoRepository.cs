using System.Linq.Expressions;

namespace Context.Repos
{
    public interface IMongoRepository<TEntity> where TEntity : MongoDocument
    {

        IEnumerable<TEntity> FilterBy(
            Expression<Func<TEntity, bool>> filterExpression);

        Task<TEntity> FindOneAsync(Expression<Func<TEntity, bool>> filterExpression);


        Task<TEntity> FindByIdAsync(String id);

        Task<TEntity> InsertOrUpdateOneAsync(TEntity document);

        Task DeleteOneAsync(Expression<Func<TEntity, bool>> filterExpression);

        Task DeleteByIdAsync(string id);

        Task DeleteManyAsync(Expression<Func<TEntity, bool>> filterExpression);
    }
}
