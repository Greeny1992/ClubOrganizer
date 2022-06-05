using Context.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Context.Repos.Concrete
{
    public interface IClubRepository : IMongoRepository<Club>
    {
        Task<Club> FindByName(string name);
    }
}
