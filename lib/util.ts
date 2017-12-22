
export function isSimpleType(type)
{
	return (type === 'uInt32' ||
		type === 'sInt32' ||
		type === 'int32' ||
		type === 'uInt64' ||
		type === 'sInt64' ||
		type === 'float' ||
		type === 'double');
};

export function equal(obj0, obj1)
{
	for (var key in obj0)
	{
		var m = obj0[key];
		var n = obj1[key];

		if (typeof (m) === 'object')
		{
			if (!equal(m, n))
			{
				return false;
			}
		} else if (m !== n)
		{
			return false;
		}
	}

	return true;
};