using Context.DAL;
using Context.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Context.Repos.Concrete
{
    public class ClubRepository : MongoRepository<Club>, IClubRepository
    {
        public ClubRepository(MongoDBContext Context) : base(Context) { }
        public async Task<Club> FindByName(string name)
        {
            return await FindOneAsync(x => x.Name == name);
        }
    }
}
