using Context.DAL;
using Context.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Context.Repos.Concrete
{
    public class GroupRepository : MongoRepository<Group>, IGroupRepository
    {
        public GroupRepository(MongoDBContext Context) : base(Context) { }

        public async Task<Group> FindByName(string name)
        {
            return await FindOneAsync(x => x.Name == name);
        }
    }
}
