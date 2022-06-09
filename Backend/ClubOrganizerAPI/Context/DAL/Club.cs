using MongoDB.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Context.DAL
{
    public class Club : MongoDocument
    {
        public string Name { get; set; }

        public string OwnerID { get; set; }
        public ICollection<string> AdminIDs { get; set; } = new List<string>();
        public ICollection<string> MemberIDs { get; set; } = new List<string>();
        public ICollection<Group> Groups { get; set; } = new List<Group>();
        public ICollection<Event> Events { get; set; } = new List<Event>();

    }
}
