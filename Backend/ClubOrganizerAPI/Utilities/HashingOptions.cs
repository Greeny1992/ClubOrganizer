using Microsoft.Extensions.Options;

namespace Utilities
{
    public sealed class HashingOptions
    {
        public int Iterations { get; set; } = 10000;
    }
}
