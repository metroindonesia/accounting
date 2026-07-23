export async function headerCreating(self, tx, data, seqdata, args) {

	if (data.program_variance === '') {
		data.program_variance = null
	}
}