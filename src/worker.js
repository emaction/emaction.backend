
const cors_headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PATCH",
}

export default {
  // eslint-disable-next-line no-unused-vars
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { searchParams } = url
    if (request.method.toLowerCase() === 'get' && url.pathname === '/reactions') {
      const targetId = searchParams.get("targetId")
      if (!targetId) {
        return new Response("Empty targetId", {
          status: 400,
          headers: {
            ...cors_headers,
          }
        })
      }
      const result = await env.d1.prepare('select reaction_name, count from reactions where target_id = ?1;')
        .bind(targetId)
        .all()
      if (result?.success && result.results) {
        return this.returnJson(0, 'success', { reactionsGot: result.results })
      } else {
        return this.returnJson(1, 'fail')
      }
    } else if (request.method.toLowerCase() === 'patch' && url.pathname === '/reaction') {
      const targetId = searchParams.get('targetId')
      const reaction_name = searchParams.get('reaction_name')
      let diff = parseInt(searchParams.get('diff'))
      if (typeof diff === 'number' && isFinite(diff)) {
        diff = diff > 0 ? 1 : -1
      } else {
        diff = 0
      }
      if (!targetId || !reaction_name || !diff) {
        return new Response("Invalid Response.", {
          status: 400,
          headers: { ...cors_headers, }
        })
      }
      const count = await env.d1.prepare('select count from reactions where target_id = ?1 and reaction_name = ?2')
        .bind(targetId, reaction_name)
        .first('count')
      let stmt = null
      if (count == null) {
        // insert
        stmt = env.d1.prepare(`insert into reactions (target_id, reaction_name, count, created_at, updated_at) values (?1, ?2, ?3, ${Date.now()}, ${Date.now()})`)
          .bind(targetId, reaction_name, Math.max(0, diff))
      } else {
        // update
        // TODO: updated_at
        stmt = env.d1.prepare(`update reactions set count = ?1, updated_at = ${Date.now()} where target_id = ?2 and reaction_name = ?3`)
          .bind(Math.max(0, count + diff), targetId, reaction_name)
      }
      const result = await stmt.run()
      return this.returnJson(result.success ? 0 : 1, result.success ? 'success' : 'fail')
    }
    if (request.method.toLowerCase() === 'options') {
      return new Response(
        `<img src="https://http.cat/200" alt="That's Ok.">`,
        {
          status: 200,
          headers: {
            "Content-Type": "text/html",
            ...cors_headers,
          },
        })
    }
    return new Response(
      `<img src="https://http.cat/404" alt="404 Not Found">`,
      {
        status: 404,
        headers: {
          "Content-Type": "text/html",
          ...cors_headers,
        },
      })
  },
  returnJson(code, msg, data) {
    return new Response(JSON.stringify({
      code, msg, data,
    }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
        ...cors_headers,
      },
    });
  }
};